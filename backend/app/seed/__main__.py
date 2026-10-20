import random
from datetime import datetime, timezone, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid, json

from app.core.config import settings
from app.core.security import hash_password
from app.core.database import Base
from app.models.user import User, Role, UserRole
from app.models.meter import Meter, Consumer
from app.models.dcu import DCU, DCUMeterAssignment
from app.models.reading import MeterReading, LoadProfile
from app.models.event import MeterEvent, Alarm, Outage
from app.models.billing import Tariff, TariffSlab, Bill, Payment
from app.models.compliance import ComplianceTest, NetworkTest
from app.models.system import AuditLog, FirmwareVersion

def seed_all():
    engine = create_engine(settings.DATABASE_URL_SYNC, echo=False)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    if session.query(User).first():
        session.close()
        return

    now = datetime.now(timezone.utc)

    # Roles & Users
    roles_dict = {}
    for role_name in ["super_admin", "noc_engineer", "field_engineer", "mdms_operator", "viewer", "consumer"]:
        r = Role(name=role_name, description=f"Role for {role_name}")
        session.add(r)
        session.flush()
        roles_dict[role_name] = r

    users_to_create = [
        ("admin", "admin123", "Super Admin User", "admin@smartmeter.local", "super_admin"),
        ("noc_engineer", "noc123", "NOC Operator", "noc@smartmeter.local", "noc_engineer"),
        ("field_engineer", "field123", "Field Engineer", "field@smartmeter.local", "field_engineer"),
        ("mdms_operator", "mdms123", "MDMS Specialist", "mdms@smartmeter.local", "mdms_operator"),
        ("viewer", "viewer123", "Dashboard Viewer", "viewer@smartmeter.local", "viewer"),
        ("consumer1", "consumer123", "Aarav Sharma", "consumer1@smartmeter.local", "consumer")
    ]

    for u_name, u_pass, u_full, u_email, r_name in users_to_create:
        u = User(username=u_name, hashed_password=hash_password(u_pass), full_name=u_full, email=u_email, is_active=True)
        session.add(u)
        session.flush()
        ur = UserRole(user_id=u.id, role_id=roles_dict[r_name].id)
        session.add(ur)

    # Tariffs
    tariffs = [
        Tariff(tariff_code="DOM-TOU-01", name="Domestic Time of Use", category="residential", description="Residential tariff with peak/off-peak rates", fixed_charge=75.0, tax_rate_percent=5.0, is_tou_enabled=True, is_active=True),
        Tariff(tariff_code="COM-TOU-02", name="Commercial Time of Use", category="commercial", description="Commercial enterprise tariff", fixed_charge=250.0, tax_rate_percent=12.0, is_tou_enabled=True, is_active=True),
    ]
    for t in tariffs:
        session.add(t)
        session.flush()
        s1 = TariffSlab(tariff_id=t.id, slab_order=1, slab_type="off_peak", start_time="22:00", end_time="06:00", min_units=0, rate_per_unit=3.50)
        s2 = TariffSlab(tariff_id=t.id, slab_order=2, slab_type="normal", start_time="06:00", end_time="18:00", min_units=0, rate_per_unit=5.50)
        s3 = TariffSlab(tariff_id=t.id, slab_order=3, slab_type="peak", start_time="18:00", end_time="22:00", min_units=0, rate_per_unit=8.50)
        session.add_all([s1, s2, s3])

    # DCUs (10 DCUs)
    dcus = []
    delhi_coords = [
        (28.6139, 77.2090, "Connaught Place Hub"),
        (28.5355, 77.2410, "Saket District DCU"),
        (28.5700, 77.1300, "Vasant Kunj Substation"),
        (28.6300, 77.2200, "Karol Bagh Central"),
        (28.7041, 77.1025, "Rohini Sector 7"),
        (28.6500, 77.3000, "Preet Vihar East"),
        (28.5800, 77.0500, "Dwarka Sector 12"),
        (28.6900, 77.2100, "Civil Lines North"),
        (28.5200, 77.2800, "Okhla Industrial Area"),
        (28.6700, 77.1200, "Punjabi Bagh DCU")
    ]
    for idx, (lat, lng, name) in enumerate(delhi_coords):
        d = DCU(
            dcu_id=f"DCU-DEL-{idx+1:03d}",
            name=name,
            ip_address=f"10.20.1.{idx+10}",
            firmware_version="v2.4.1",
            status="online",
            latitude=lat,
            longitude=lng,
            wan_protocol="cellular_4g",
            nan_protocol="rf_mesh",
            signal_quality=-65,
            last_heartbeat=now,
            total_connected_meters=10,
            online_meters=9,
            offline_meters=1
        )
        session.add(d)
        session.flush()
        dcus.append(d)

    # 104 Smart Meters & Consumers
    for i in range(1, 105):
        c = Consumer(
            consumer_number=f"CON-DEL-{i:05d}",
            name=f"Consumer {i}",
            email=f"consumer{i}@example.com",
            phone=f"+91 98110{i:05d}",
            address=f"Flat {i}, Sector {i%20 + 1}, Delhi",
            consumer_type="residential" if i <= 80 else "commercial",
            sanctioned_load=3.0 if i <= 80 else 15.0,
            tariff_id=tariffs[0].id if i <= 80 else tariffs[1].id
        )
        session.add(c)
        session.flush()

        dcu_idx = (i - 1) % len(dcus)
        base_lat, base_lng = delhi_coords[dcu_idx][0], delhi_coords[dcu_idx][1]
        lat = base_lat + random.uniform(-0.02, 0.02)
        lng = base_lng + random.uniform(-0.02, 0.02)

        is_direct = (i % 3 == 0)
        status_str = "online"
        if i == 13 or i == 45:
            status_str = "power_off"
        elif i == 29:
            status_str = "warning"
        elif i == 88:
            status_str = "offline"

        v_val = 232.0 if status_str != "power_off" else 0.0
        c_val = round(random.uniform(1.0, 30.0), 2) if status_str != "power_off" else 0.0
        p_val = round(v_val * c_val * 0.95 / 1000.0, 3)

        acc_classes = ["0.2S", "0.5S", "1.0S"]
        m_id_str = "SM0123456789" if i == 1 else f"MTR-IS16444-{i:05d}"

        m = Meter(
            meter_id=m_id_str,
            serial_number=f"KUSHAL-U1-CAA1-{i:05d}",
            meter_type="transformer_operated_static",
            accuracy_class=acc_classes[(i - 1) % 3],
            phase="single_phase" if i <= 80 else "three_phase",
            rated_voltage=240.0 if i <= 80 else 415.0,
            rated_current=5.0,
            max_current=30.0 if i <= 80 else 100.0,
            frequency=50.0,
            firmware_version="v1.2.4",
            manufacturer="Vardhman Airport Solutions Ltd. (Kimbal Kushal U1-CAA1)",
            connectivity_type="cellular_4g" if is_direct else "rf_mesh",
            topology="direct_wan" if is_direct else "nan_dcu",
            ip_address=f"10.20.100.{i}",
            latitude=lat,
            longitude=lng,
            status=status_str,
            voltage=v_val,
            current=c_val,
            active_power=p_val,
            power_factor=0.95 if status_str != "power_off" else 0.0,
            import_energy=round(150.0 + (i * 12.5), 2),
            last_communication=now,
            last_reading_time=now,
            consumer_id=c.id
        )
        session.add(m)
        session.flush()

        # Reading & Bill
        rd = MeterReading(
            meter_id=m.id, reading_time=now, reading_type="periodic",
            voltage=v_val, current=c_val, active_power=p_val, power_factor=0.95,
            import_active_energy=m.import_energy, source="hes", vee_status="validated"
        )
        session.add(rd)

        bill = Bill(
            bill_number=f"BILL-2026-DEL-{i:05d}", consumer_id=c.id, meter_id=m.id,
            tariff_id=c.tariff_id, billing_period_start=now - timedelta(days=30),
            billing_period_end=now, bill_date=now - timedelta(days=2),
            due_date=now + timedelta(days=13), total_active_energy=180.0,
            energy_charge=1050.0, fixed_charge=75.0, tax_amount=56.25, total_amount=1181.25,
            status="paid" if i % 2 == 0 else "due"
        )
        session.add(bill)

        if status_str == "power_off":
            ev = MeterEvent(
                event_id=f"EVT-LG-{i:04d}",
                meter_id=m.id, event_code="IS15959-EA-101", event_type="last_gasp",
                event_category="power_outage",
                severity="critical", description="Clause 10 Last Gasp (Power OFF): Outage detected & transmitted using built-in supercapacitor energy storage before shutdown",
                event_time=now - timedelta(minutes=18), acknowledged=False
            )
            al = Alarm(
                alarm_id=f"ALM-LG-{i:04d}", meter_id=m.id, dcu_id=dcus[dcu_idx].id,
                alarm_type="power_outage_last_gasp",
                severity="critical", status="active",
                description=f"Last Gasp (Power OFF) — {m.meter_id}: Grid power loss detected; supercapacitor backup sent Last Gasp packet to HES.",
                raised_at=now - timedelta(minutes=18)
            )
            out = Outage(
                outage_id=f"OUT-2026-{i:04d}", meter_id=m.id,
                status="ongoing", start_time=now - timedelta(minutes=18),
                cause="Distribution Transformer Feeder Trip (Last Gasp Alert)",
                area=delhi_coords[dcu_idx][2]
            )
            session.add_all([ev, al, out])

    # Add First Breath resolved outage & NIC Cover Tamper events
    ev_fb = MeterEvent(
        event_id="EVT-FB-0001",
        meter_id=1, event_code="IS15959-EA-102", event_type="first_breath",
        event_category="power_restoration",
        severity="info", description="Clause 10 First Breath (Power ON): Grid power restoration detected and immediately transmitted to HES",
        event_time=now - timedelta(hours=2), acknowledged=True
    )
    ev_nic = MeterEvent(
        event_id="EVT-NIC-0029",
        meter_id=29, event_code="IS15959-TAMPER-204", event_type="tamper_nic_cover",
        event_category="tamper",
        severity="warning", description="NIC Cover Sealing Screw tamper alert detected on field-swappable NAN/WAN module",
        event_time=now - timedelta(minutes=42), acknowledged=False
    )
    ev_neg = MeterEvent(
        event_id="EVT-NEG-0010",
        meter_id=10, event_code="IS16444-BILL-301", event_type="negative_charge_alert",
        event_category="billing",
        severity="warning", description="4-6-10m Network Test: Negative charge detected; disconnection check & consumer email alert dispatched",
        event_time=now - timedelta(minutes=12), acknowledged=False
    )
    session.add_all([ev_fb, ev_nic, ev_neg])

    # Clause 9 & Table 1 — All 11 BIS Mandatory Testing Schedule Items
    bis_table_1_tests = [
        ("BIS-TBL1-01", "Short Time Over Current", "IS 16444 (Part 2) Cl. 6.10.3", "electrical", "IS 14697 Cl. 9.2.3", "IS 5884 Cl. 4.4.3"),
        ("BIS-TBL1-02", "Test of Immunity to Electromagnetic HF Field", "IS 16444 (Part 2) Cl. 6.11", "emc_immunity", "IS 15884 Cl. 10", "IS 5884 Cl. 4.5, 5.5"),
        ("BIS-TBL1-03", "EMI Test", "IS 16444 (Part 2) Cl. 6.11", "emi_emc", "IS 15884 Cl. 10", "IS 5884 Cl. 4.5, 5.5"),
        ("BIS-TBL1-04", "Resistance to Heat and Fire", "IS 16444 (Part 2) Cl. 6.4", "mechanical_thermal", "IS 14697 Cl. 6.8", "IS 13779 Cl. 6.8"),
        ("BIS-TBL1-05", "Surge Immunity Test", "IS 16444 (Part 2) Cl. 6.11", "emc_immunity", "IS 14697 Cl. 12.8.5 / IS 13779 Cl. 12.9.5", "IS 14700 (Part 4/Sec 5)"),
        ("BIS-TBL1-06", "Electrostatic Discharge (ESD) Test", "IS 16444 (Part 2) Cl. 6.11", "emc_immunity", "IS 14697 Cl. 10", "IS 15884 Cl. 4.5, 5.5"),
        ("BIS-TBL1-07", "Electrostatic discharge", "IS 16444 (Part 2) Cl. 6.11", "emc_immunity", "IS 15884 Cl. 10", "IS 5884 Cl. 4.5, 5.5"),
        ("BIS-TBL1-08", "AC Electromagnetic", "IS 16444 (Part 2) Cl. 6.11", "magnetic", "IS 14697 Cl. 10", "IS 15884 Cl. 4.5, 5.5"),
        ("BIS-TBL1-09", "DC Electromagnetic", "IS 16444 (Part 2) Cl. 6.11", "magnetic", "IS 14697 Cl. 10", "IS 15884 Cl. 4.5, 5.5"),
        ("BIS-TBL1-10", "Test for Climatic Influences: 1. Dry Heat Test | 2. Cold Test | 3. Damp Heat Cycle Test", "IS 16444 (Part 2) Cl. 6.9", "climatic", "IS 15884 Cl. 4.5, 5.5", "IS 14697 Cl. 8 and 12.6"),
        ("BIS-TBL1-11", "Resistive Load 40A and 100A", "IS 16444 (Part 2) Cl. 6.4", "load_performance", "IS 14697 Cl. 6.8", "IS 13779 Cl. 6.8"),
    ]
    for code, name, clause, cat, req_std, method_std in bis_table_1_tests:
        session.add(ComplianceTest(
            test_code=code, test_name=name, clause_reference=clause,
            test_category=cat, parameters=req_std, results=method_std,
            status="passed", test_date=now, tested_by="BIS / NABL Accredited Test Lab (WPC & DoT ETA Certified)"
        ))

    # Seed 4m, 6m, 10m Cellular Certification Network Tests (Slide 2)
    for dist, m_target, rssi_val, lat_ms in [(4, 4, -58.0, 19.4), (6, 6, -64.0, 24.8), (10, 10, -71.0, 31.2)]:
        session.add(NetworkTest(
            test_type=f"{dist}m_cellular_certification",
            meter_id=m_target,
            dcu_id=1,
            latency_ms=lat_ms,
            packet_loss_pct=0.0,
            rssi=rssi_val,
            snr=24.5,
            status="passed",
            test_time=now - timedelta(minutes=dist*5),
            details=f"{dist}-meter network test: Power parameters verified, billing updated, negative charge disconnection & consumer email verified."
        ))

    fw1 = FirmwareVersion(version_code="v1.2.4", target_hardware="KUSHAL-U1-CAA1 (IS 16444 Pt 2)", release_date=now - timedelta(days=60), checksum="sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", release_notes="Official BIS IS 16444 Part 2:2017 release for Class 0.2S, 0.5S & 1.0S meters")
    session.add(fw1)

    session.commit()
    session.close()

if __name__ == "__main__":
    seed_all()

