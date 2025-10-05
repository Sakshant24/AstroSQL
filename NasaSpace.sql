CREATE DATABASE IF NOT EXISTS nasa_space;
USE nasa_space;

DROP PROCEDURE IF EXISTS AvgMissionCost;
DROP TRIGGER IF EXISTS after_mission_insert;
DROP VIEW IF EXISTS vw_successful_mission_summary;

DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `mission_researchers`;
DROP TABLE IF EXISTS `researchers`;
DROP TABLE IF EXISTS `mission_instruments`;
DROP TABLE IF EXISTS `instruments`;
DROP TABLE IF EXISTS `milestones`;
DROP TABLE IF EXISTS `mission_launch`;
DROP TABLE IF EXISTS `launch_vehicles`;
DROP TABLE IF EXISTS `technical_specs`;
DROP TABLE IF EXISTS `budget_records`;
DROP VIEW IF EXISTS `vw_successful_mission_summary`;
DROP TABLE IF EXISTS `missions`;


CREATE TABLE `missions` (
  `mission_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `launch_date` DATE,
  `destination_planet` VARCHAR(100),
  `mission_status` ENUM('Operational','Success','Completed','Failed','Launched') NOT NULL,
  `duration_days` INT,
  `mission_type` VARCHAR(100),
  `objective` TEXT,
  PRIMARY KEY (`mission_id`)
) ENGINE=InnoDB;
ALTER TABLE missions MODIFY COLUMN mission_status ENUM('Operational','Success','Completed','Failed','Launched', 'Planned') NOT NULL;

CREATE TABLE `budget_records` (
  `budget_id` INT NOT NULL AUTO_INCREMENT,
  `mission_id` INT NOT NULL,
  `year` YEAR,
  `cost_then` DECIMAL(12,2),
  `cost_nsii` DECIMAL(12,2),
  `cost_pcepi` DECIMAL(12,2),
  PRIMARY KEY (`budget_id`),
  FOREIGN KEY (`mission_id`) REFERENCES `missions`(`mission_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `technical_specs` (
  `spec_id` INT NOT NULL AUTO_INCREMENT,
  `mission_id` INT NOT NULL UNIQUE,
  `spacecraft_mass_kg` FLOAT,
  `power_source` VARCHAR(50),
  `instrument_payload_count` INT,
  PRIMARY KEY (`spec_id`),
  FOREIGN KEY (`mission_id`) REFERENCES `missions`(`mission_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `instruments` (
  `instrument_id` INT NOT NULL AUTO_INCREMENT,
  `instrument_name` VARCHAR(100) NOT NULL UNIQUE,
  `type` VARCHAR(50),
  `purpose` TEXT,
  PRIMARY KEY (`instrument_id`)
) ENGINE=InnoDB;

CREATE TABLE `mission_instruments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mission_id` INT NOT NULL,
  `instrument_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mission_id`) REFERENCES `missions`(`mission_id`) ON DELETE CASCADE,
  FOREIGN KEY (`instrument_id`) REFERENCES `instruments`(`instrument_id`) ON DELETE CASCADE,
  UNIQUE KEY `mission_instrument_unique` (`mission_id`, `instrument_id`)
) ENGINE=InnoDB;

CREATE TABLE `launch_vehicles` (
  `vehicle_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `manufacturer` VARCHAR(100),
  `payload_capacity_kg` FLOAT,
  `orbit_type` VARCHAR(50),
  PRIMARY KEY (`vehicle_id`)
) ENGINE=InnoDB;

CREATE TABLE `mission_launch` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mission_id` INT NOT NULL UNIQUE,
  `vehicle_id` INT,
  `launch_site` VARCHAR(100),
  `launch_success` BOOLEAN,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mission_id`) REFERENCES `missions`(`mission_id`) ON DELETE CASCADE,
  FOREIGN KEY (`vehicle_id`) REFERENCES `launch_vehicles`(`vehicle_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE `researchers` (
  `researcher_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `affiliation` VARCHAR(100),
  `specialty_area` VARCHAR(100),
  PRIMARY KEY (`researcher_id`)
) ENGINE=InnoDB;

CREATE TABLE `mission_researchers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mission_id` INT NOT NULL,
  `researcher_id` INT NOT NULL,
  `role` VARCHAR(50),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mission_id`) REFERENCES `missions`(`mission_id`) ON DELETE CASCADE,
  FOREIGN KEY (`researcher_id`) REFERENCES `researchers`(`researcher_id`) ON DELETE CASCADE,
  UNIQUE KEY `mission_researcher_unique` (`mission_id`, `researcher_id`)
) ENGINE=InnoDB;

CREATE TABLE `milestones` (
  `milestone_id` INT NOT NULL AUTO_INCREMENT,
  `mission_id` INT NOT NULL,
  `event_date` DATE NOT NULL,
  `milestone_type` VARCHAR(100),
  `description` TEXT,
  PRIMARY KEY (`milestone_id`),
  FOREIGN KEY (`mission_id`) REFERENCES `missions`(`mission_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `audit_logs` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `table_name` VARCHAR(50),
  `operation` ENUM('INSERT','UPDATE','DELETE'),
  `record_pk` INT,
  `performed_by` VARCHAR(100),
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB;


-- Data for: missions
INSERT INTO `missions` (`mission_id`, `name`, `launch_date`, `destination_planet`, `mission_status`, `duration_days`, `mission_type`, `objective`) VALUES
(1, '2001 Mars Odyssey', '2001-04-07', 'Mars', 'Operational', 8925, 'Orbiter', 'Study Martian radiation and surface.'),(2, 'Cassini', '1997-10-15', 'Saturn', 'Completed', 7275, 'Orbiter', 'Study Saturn, rings, and moons.'),(3, 'Contour', '2002-07-03', 'Comet', 'Failed', 0, 'Flyby', 'Observe multiple comets.'),(4, 'Dart', '2021-11-24', 'Asteroid', 'Completed', 306, 'Impact', 'Test asteroid deflection.'),(5, 'Dawn', '2007-09-27', 'Asteroid', 'Completed', 4053, 'Orbiter', 'Study Vesta and Ceres.'),(6, 'Deep Impact', '2005-01-12', 'Comet', 'Completed', 3132, 'Rendezvous', 'Impact comet Tempel 1.'),(7, 'Deep Space 1', '1998-10-24', 'Comet', 'Completed', 1150, 'Flyby', 'Test propulsion and autonomy.'),(8, 'Galileo', '1989-10-18', 'Jupiter', 'Completed', 5086, 'Orbiter', 'Study Jupiter and moons.'),(9, 'Genesis', '2001-08-08', 'L1', 'Completed', 1127, 'Sample Return', 'Collect solar wind samples.'),(10, 'Grail-A', '2011-09-10', 'Lunar', 'Completed', 464, 'Orbiter', 'Map lunar gravity field.'),(11, 'Grail-B', '2011-09-10', 'Lunar', 'Completed', 464, 'Orbiter', 'Map lunar gravity field.'),(12, 'InSight', '2018-05-05', 'Mars', 'Completed', 1685, 'Lander', 'Study Mars interior.'),(13, 'Juno', '2011-08-05', 'Jupiter', 'Operational', 5003, 'Orbiter', 'Study Jupiter atmosphere.'),(14, 'LADEE', '2013-09-07', 'Lunar', 'Completed', 223, 'Orbiter', 'Study lunar exosphere.'),(15, 'Lucy', '2021-10-16', 'Jupiter', 'Operational', 1278, 'Flyby', 'Study Trojan asteroids.'),(16, 'Lunar Prospector', '1998-01-06', 'Lunar', 'Completed', 571, 'Orbiter', 'Map lunar composition.'),(17, 'Mars 2020 Perseverance', '2020-07-30', 'Mars', 'Operational', 1326, 'Rover', 'Search for past life.'),(18, 'Magellan', '1989-05-04', 'Venus', 'Completed', 1987, 'Orbiter', 'Map Venus surface.'),(19, 'Mars Climate Orbiter', '1998-12-11', 'Mars', 'Failed', 286, 'Orbiter', 'Climate study of Mars.'),(20, 'Mars Global Surveyor', '1996-11-07', 'Mars', 'Completed', 3648, 'Orbiter', 'Map Mars globally.'),(21, 'Mars Observer', '1992-09-25', 'Mars', 'Failed', 330, 'Orbiter', 'Study Mars climate and surface.'),(22, 'Mars Pathfinder', '1996-12-04', 'Mars', 'Completed', 297, 'Lander/Rover', 'Tech demo and surface study.'),(23, 'Mars Polar Lander', '1999-01-03', 'Mars', 'Failed', 334, 'Lander', 'Study polar regions.'),(24, 'Mars Reconnaissance Orbiter', '2005-08-12', 'Mars', 'Operational', 6791, 'Orbiter', 'High-res Mars mapping.'),(25, 'MAVEN', '2013-11-18', 'Mars', 'Operational', 3772, 'Orbiter', 'Study upper atmosphere.'),(26, 'MER-A Spirit', '2003-06-10', 'Mars', 'Completed', 2208, 'Rover', 'Mars exploration rover A.'),(27, 'MER-B Opportunity', '2003-07-08', 'Mars', 'Completed', 5111, 'Rover', 'Mars exploration rover B.'),(28, 'MESSENGER', '2004-08-03', 'Mercury', 'Completed', 4383, 'Orbiter', 'Study Mercury composition.'),(29, 'MSL Curiosity', '2011-11-26', 'Mars', 'Operational', 4400, 'Rover', 'Mars Science Laboratory rover.'),(30, 'NEAR Shoemaker', '1996-02-17', 'Asteroid Eros', 'Completed', 1825, 'Orbiter/Lander', 'Study of asteroid Eros.'),(31, 'New Horizons', '2006-01-19', 'Pluto/KBOs', 'Operational', 6200, 'Flyby', 'Pluto and Kuiper Belt exploration.'),(32, 'OSIRIS-REx', '2016-09-08', 'Asteroid Bennu', 'Operational', 2557, 'Sample Return', 'Sample return from Bennu.'),(33, 'Phoenix', '2007-08-04', 'Mars', 'Completed', 152, 'Lander', 'Study polar ice and soil of Mars.'),(34, 'Psyche', '2023-10-13', 'Asteroid Psyche', 'Launched', NULL, 'Orbiter', 'Study metallic asteroid Psyche.'),(35, 'Stardust', '1999-02-07', 'Comet Wild 2', 'Completed', 2557, 'Sample Return', 'Comet dust sample return');

-- Data for: launch_vehicles
INSERT INTO `launch_vehicles` (`vehicle_id`, `name`, `manufacturer`, `payload_capacity_kg`, `orbit_type`) VALUES
(1, 'Delta 7925', 'McDonnell Douglas/Boeing', 4200, 'LEO'),(2, 'Titan 4', 'Lockheed Martin', 21000, 'LEO'),(3, 'Delta 7425', 'McDonnell Douglas/Boeing', 3700, 'LEO'),(4, 'Falcon 9', 'SpaceX', 22800, 'LEO'),(5, 'Delta 7326', 'McDonnell Douglas/Boeing', 3600, 'LEO'),(6, 'Delta 7920', 'McDonnell Douglas/Boeing', 4100, 'LEO'),(7, 'Atlas 5', 'United Launch Alliance', 18500, 'LEO'),(8, 'Minotaur V', 'Orbital Sciences', 580, 'Trans-Lunar Injection'),(9, 'Athena 2', 'Lockheed Martin', 1800, 'LEO'),(10, 'STS 34', 'NASA', 24400, 'LEO'),(11, 'STS', 'NASA', 24400, 'LEO'),(12, 'Titan 3', 'Martin Marietta', 15400, 'LEO'),(13, 'Delta 7925H', 'McDonnell Douglas/Boeing', 4500, 'LEO'),(14, 'Delta 7426', 'McDonnell Douglas/Boeing', 3700, 'LEO'),(15, 'Falcon Heavy', 'SpaceX', 63800, 'LEO');

-- Data for: mission_launch
INSERT INTO `mission_launch` (`mission_id`, `vehicle_id`, `launch_site`, `launch_success`) VALUES
(1, 1, 'Cape Canaveral', TRUE), (2, 2, 'Cape Canaveral', TRUE), (3, 3, 'Cape Canaveral', FALSE), (4, 4, 'Vandenberg', TRUE), (5, 1, 'Cape Canaveral', TRUE), (6, 1, 'Cape Canaveral', TRUE), (7, 5, 'Cape Canaveral', TRUE), (8, 10, 'Kennedy Space Center', TRUE), (9, 5, 'Cape Canaveral', TRUE), (10, 6, 'Cape Canaveral', TRUE), (11, 6, 'Cape Canaveral', TRUE), (12, 7, 'Vandenberg', TRUE), (13, 7, 'Cape Canaveral', TRUE), (14, 8, 'Wallops Flight Facility', TRUE), (15, 7, 'Cape Canaveral', TRUE), (16, 9, 'Cape Canaveral', TRUE), (17, 7, 'Cape Canaveral', TRUE), (18, 11, 'Kennedy Space Center', TRUE), (19, 3, 'Cape Canaveral', FALSE), (20, 1, 'Cape Canaveral', TRUE), (21, 12, 'Cape Canaveral', FALSE), (22, 1, 'Cape Canaveral', TRUE), (23, 3, 'Cape Canaveral', FALSE), (24, 7, 'Cape Canaveral', TRUE), (25, 7, 'Cape Canaveral', TRUE), (26, 1, 'Cape Canaveral', TRUE), (27, 13, 'Cape Canaveral', TRUE), (28, 1, 'Cape Canaveral', TRUE), (29, 7, 'Cape Canaveral', TRUE), (30, 1, 'Cape Canaveral', TRUE), (31, 7, 'Cape Canaveral', TRUE), (32, 7, 'Cape Canaveral', TRUE), (33, 1, 'Cape Canaveral', TRUE), (34, 15, 'Cape Canaveral', TRUE), (35, 14, 'Cape Canaveral', TRUE);

-- Data for: budget_records
INSERT INTO `budget_records` (`mission_id`, `year`, `cost_then`, `cost_nsii`, `cost_pcepi`) VALUES
(1, 2001, 297.00, 420.00, 410.50), (2, 1997, 3212.52, 5200.00, 5000.00), (3, 2002, 143.20, 210.00, 205.00), (4, 2021, 326.30, 326.30, 326.30), (5, 2007, 502.10, 650.00, 640.00), (6, 2005, 397.30, 520.00, 510.00), (7, 1998, 170.30, 230.00, 225.00), (8, 1989, 1057.88, 2100.00, 2000.00), (9, 2001, 264.00, 370.00, 365.00), (10, 2011, 372.00, 380.00, 375.00), (11, 2011, 372.00, 380.00, 375.00), (12, 2018, 814.00, 820.00, 815.00), (13, 2011, 1100.00, 1200.00, 1180.00), (14, 2013, 280.00, 300.00, 295.00), (15, 2021, 981.00, 981.00, 981.00), (16, 1998, 63.00, 80.00, 78.00), (17, 2020, 2600.00, 2600.00, 2600.00), (18, 1989, 680.00, 1100.00, 1050.00), (19, 1998, 193.00, 250.00, 245.00), (20, 1996, 1540.00, 2000.00, 1950.00), (21, 1992, 813.00, 1100.00, 1050.00), (22, 1996, 265.00, 320.00, 315.00), (23, 1999, 165.00, 210.00, 205.00), (24, 2005, 720.00, 940.00, 920.00), (25, 2013, 582.00, 600.00, 590.00), (26, 2003, 450.00, 500.00, 490.00), (27, 2003, 450.00, 500.00, 490.00), (28, 2004, 446.00, 580.00, 570.00), (29, 2011, 2500.00, 2600.00, 2580.00), (30, 1996, 224.00, 300.00, 290.00), (31, 2006, 720.00, 880.00, 860.00), (32, 2016, 1080.00, 1100.00, 1090.00), (33, 2007, 386.00, 500.00, 490.00), (34, 2023, 850.00, 850.00, 850.00), (35, 1999, 300.00, 400.00, 390.00);

-- Data for: technical_specs
-- NOTE: `spacecraft_mass_kg` is taken from your `launch_mass_kg` column. `instrument_payload_count` is calculated from  `mission_instruments` data.
INSERT INTO `technical_specs` (`mission_id`, `spacecraft_mass_kg`, `power_source`, `instrument_payload_count`) VALUES
(1, 758, 'SA', 3), (2, 5712, 'RTG', 12), (3, 775, 'SA', 4), (4, 610, 'SA', 2), (5, 1217.7, 'SA', 3), (6, 1020, 'SA', 3), (7, 486.3, 'SA', 3), (8, 2380, 'RTG', 10), (9, 636, 'SA', 2), (10, 306, 'SA', 2), (11, 306, 'SA', 2), (12, 721, 'SA', 6), (13, 3625, 'SA', 8), (14, 375.5, 'SA', 3), (15, 1550, 'SA', 4), (16, 296.4, 'SA', 5), (17, 3839, 'RTG', 8), (18, 3449, 'SA', 1), (19, 629, 'SA', 2), (20, 1030.5, 'SA', 6), (21, 2573, 'SA', 8), (22, 895, 'SA', 6), (23, 583, 'SA', 5), (24, 2180, 'SA', 7), (25, 2454, 'SA', 8), (26, 1063, 'SA', 7), (27, 1063, 'SA', 7), (28, 1108, 'SA', 7), (29, 3839, 'RTG', 8), (30, 818, 'SA', 6), (31, 585, 'RTG', 7), (32, 1955, 'SA', 6), (33, 664, 'SA', 6), (34, 2800, 'SA', 3), (35, 385, 'SA', 3);

-- Data for: instruments
INSERT INTO `instruments` (`instrument_id`, `instrument_name`, `type`, `purpose`) VALUES
(1,'MARIE','Radiation Experiment','Martian Radiation Environment Experiment'), (2,'THEMIS','Imager','Thermal Emission Imaging System'), (3,'GRS','Spectrometer','Gamma Ray Spectrometer'), (4,'CIRS','Spectrometer','Composite Infra-Red Spectrometer'), (5,'CDA','Dust Analyzer','Cosmic Dust Analyzer'), (6,'MAG','Magnetometer','Dual Technique Magnetometer'), (7,'ISS','Imager','Imaging Science Subsystem'), (8,'INMS','Mass Spectrometer','Ion Neutral Mass Spectrometer'), (9,'MIMI','Imager','Magnetospheric Imaging Instrument'), (10,'CAPS','Plasma Spectrometer','Cassini Plasma Spectrometer'), (11,'RPWS','Wave Science','Radio and Plasma Wave Science'), (12,'RADAR','Radar','Cassini Radar'), (13,'UVIS','Spectrograph','Ultraviolet Imaging Spectrograph'), (14,'VIMS','Spectrometer','Visual and Infrared Mapping Spectrometer'), (15,'RSS','Radio Science','Radio Science Subsystem'), (16,'CRISP','Imager/Spectrograph','Contour Remote Imager/Spectrograph'), (17,'CIDA','Dust Analyzer','Comet Impact Dust Analyzer'), (18,'NGIMS','Mass Spectrometer','Neutral Gas and Ion Mass Spectrometer'), (19,'CFI','Imager','Contour Forward Imager'), (20,'DRACO','Imager/OpNav','Didymos Reconnaissance and Asteroid Camera for OpNav'), (21,'LICIA CubeSat','Imager','Light Italian CubeSat for Imaging of Asteroids'), (22,'Framing Camera','Imager','Framing Camera for Dawn Mission'), (23,'GRaND','Spectrometer','Gamma Ray and Neutron Spectrometer'), (24,'VIR','Spectrometer','Visual and Infrared Imaging Spectrometer'), (25,'HRI','Imager','High Resolution Imager'), (26,'MRI','Imager','Medium Resolution Imager'), (27,'ITS','Sensor','Impact Targeting Sensor'), (28,'MICAS','Camera/Spectrometer','Miniature Integrated Camera Spectrometer'), (29,'PEPE','Plasma Experiment','Plasma Experiment for Planetary Exploration'), (30,'IPS/IDS','Propulsion/Diagnostic','Ion Propulsion System/Ion Diagnostic Subsystem'), (31,'DDS','Dust Detector','Dust Detection System'), (32,'EPD','Particle Detector','Energetic Particles Detector'), (33,'HIC','Ion Counter','Heavy Ion Counter'), (34,'NIMS','Mapping Spectrometer','Near Infrared Mapping Spectrometer'), (35,'PPR','Photopolarimeter-Radiometer','Photopolarimeter-Radiometer'), (36,'PLS','Plasma Detector','Plasma Detector'), (37,'PWS','Wave Spectrometer','Plasma Wave Spectrometer'), (38,'SSI','Imager','Solid-State Imaging'), (39,'UVS/EUVS','Spectrometer','Ultraviolet Spectrometer and Extreme Ultraviolet Spectrometer'), (40,'SWIM','Ion Monitor','Solar Wind Ion Monitor'), (41,'ELM','Electron Monitor','Electron Monitor'), (42,'LGRS','Gravity Ranging','Lunar Gravity Ranging System'), (43,'MoonKam','Camera','MoonKam student camera'), (44,'SEIS','Seismometer','Seismic Experiment for Interior Structure'), (45,'HP3','Heat Flow Probe','Heat Flow and Physical Properties Package'), (46,'RISE','Radio Science','Rotation and Interior Structure Experiment'), (47,'IDS','Deployment System','Instrument Deployment System'), (48,'APSS','Sensor Suite','Auxiliary Payload Sensor Suite'), (49,'LaRRI','Retro-Reflector','Laser Retro-Reflector of Insight'), (50,'MWR','Radiometer','Microwave Radiometer'), (51,'JEDI','Particle Detector','Jupiter Energetic-particle Detector Instrument'), (52,'JADE','Auroral Distribution','Jovian Auroral Distribution Experiment'), (53,'UVS','Spectrograph','Ultraviolet Spectrograph'), (54,'Waves','Wave Instrument','Radio and Plasma Wave Instrument'), (55,'JunoCam','Camera','Juno Camera'), (56,'JIRAM','Auroral Mapper','Jovian Infrared Auroral Mapper'), (57,'Gravity Science','Gravity Science','Gravity Science Experiment'), (58,'NMS','Mass Spectrometer','Neutral Mass Spectrometer'), (59,'LDEX','Dust Experiment','Lunar Dust Experiment'), (60,'LLST','Laser Comms','Lunar Laser Communications Demonstration'), (61,'L''LORRI','Imager','high resolution imaging'), (62,'L''TES','Thermal Imager','measures thermal infrared emission'), (63,'L''Ralph','Imager/Spectral Array','Multispectral Visible Imaging Camera and Linear Etalon Imaging Spectral Array'), (64,'TTCam','Camera','Terminal Tracking Camera'), (65,'APS/NS','Spectrometer','Alpha Particle Spectrometer/ Neutron Spectrometer'), (66,'SES','Spectrometer','Spectrometer Electronics System'), (67,'DGE','Gravity Experiment','Doppler Gravity Experiment'), (68,'Ingenuity','Helicopter','Helicopter technology demonstration'), (69,'Mastcam-Z','Camera','Mast Zoom Camera'), (70,'MEDA','Dynamics Analyzer','Mars Environmental Dynamics Analyzer'), (71,'MOXIE','ISRU Experiment','Mars Oxygen ISRU Experiment'), (72,'PIXL','X-ray Lithochemistry','Planetary Instrument for X-ray Lithochemistry'), (73,'RIMFAX','Radar Imager','Radar Imager for Mars Subsurface Exploration'), (74,'SHERLOC','Raman/Luminescence','Scanning Habitable Environments with Raman and Luminescence for Organics and Chemicals'), (75,'SuperCam','Multisensor','SuperCam Instrument Suite'), (76,'RDRS','Radar System','Radar system with SAR, Altimetry, and Radiometry modes'), (77,'MARCI','Imager','Mars Color Imager'), (78,'PMIRR','Radiometer','Pressure Modulated Infrared Radiometer'), (79,'MOC','Camera','Mars Orbiter Camera'), (80,'MOLA','Laser Altimeter','Mars Orbiter Laser Altimeter'), (81,'MRCE','Relay','Mars Relay Communications Experiment'), (82,'TES','Spectrometer','Thermal Emission Spectrometer'), (83,'GRS-MO','Spectrometer','Gamma-ray Spectrometer for Mars Observer'), (84,'MBR','Relay','Mars Balloon Relay'), (85,'USO','Oscillator','Ultrastable Oscillator'), (86,'ASI/MET','Atmosphere/Meteorology','Atmospheric Structure Instrument and Meteorology Package'), (87,'IMP','Imager','Imager for Mars Pathfinder'), (88,'APXS','X-ray Spectrometer','Alpha Proton X-ray Spectrometer'), (89,'MAE','Adherence Experiment','Materials Adherence Experiment'), (90,'RIC','Imager','Rover Imaging Cameras'), (91,'WAE','Abrasion Experiment','Wheel Abrasion Experiment'), (92,'LIDAR','Lidar','Light Detection and Ranging'), (93,'MARDI','Imager','Mars Descent Imager'), (94,'MMP','Magnetic Properties','Mars Magnetic Properties'), (95,'MM','Microphone','Mars Microphone'), (96,'MVACS','Climate Surveyor','Mars Volatiles and Climate Surveyor'), (97,'CRISM','Imaging Spectrometer','Compact Reconnaissance Imaging Spectrometer'), (98,'CTX','Imager','Context Imager'), (99,'HIRISE','Imager','High Resolution Imaging Experiment'), (100,'MCS','Climate Sounder','Mars Climate Sounder'), (101,'SHARAD','Radar','Shallow Radar'), (102,'ONC','Camera','Optical Navigation Camera'), (103,'IUVS','Spectrograph','Imaging Ultraviolet Spectrograph'), (104,'LPW','Probe/Waves','Langmuir Probe and Waves'), (105,'SEP','Particle Detector','Solar Energetic Particle detector'), (106,'SWEA','Electron Analyzer','Solar Wind Electron Analyzer'), (107,'SWIA','Ion Analyzer','Solar Wind Ion Analyzer'), (108,'STATIC','Ion Composition','Supra Thermal and Thermal Ion Composition'), (109,'PanCam','Camera','Panoramic Camera'), (110,'Mini-TES','Spectrometer','Miniature Thermal Emission Spectrometer'), (111,'MB','Spectrometer','Mossbauer Spectrometer'), (112,'MI','Imager','Microscopic Imager'), (113,'RAT','Abrasion Tool','Rock Abrasion Tool'), (114,'MDIS','Imaging System','Mercury Dual Imaging System'), (115,'GRNS','Spectrometer','Gamma-Ray and Neutron Spectrometer'), (116,'XRS','X-ray Spectrometer','X-ray Spectrometer'), (117,'MLA','Laser Altimeter','Mercury Laser Altimeter'), (118,'MASCS','Spectrometer','Mercury Atmospheric and Surface Composition Spectrometer'), (119,'EPPS','Particle/Plasma Spectrometer','Energetic Particle and Plasma Spectrometer'), (120,'MAHLI','Imager','Mars Hand Lens Imager'), (121,'ChemCam','Chemistry/Camera','Chemistry & Camera'), (122,'CheMin','X-Ray Diffraction','Chemistry & Mineralogy X-Ray Diffraction/X-Ray Fluorescence Instrument'), (123,'SAM','Sample Analysis','Sample Analysis at Mars Instrument Suite'), (124,'RAD','Radiation Detector','Radiation Assessment Detector'), (125,'DAN','Neutron Albedo','Dynamic of Albedo Neutrons'), (126,'REMS','Monitoring Station','Rover Environmental Monitoring Station'), (127,'NLR','Laser Rangefinder','NEAR Laser Rangefinder'), (128,'MSI','Imager','Multispectral Imager'), (129,'NIS','Spectrometer','Near-Infrared Spectrometer'), (130,'XRS-GRS','Spectrometer','X-Ray/Gamma-ray Spectrometer'), (131,'LORRI','Imager','Long Range Reconnaissance Imager'), (132,'ALICE','Spectrometer','Ultraviolet Imaging Spectrometer'), (133,'SWAP','Solar Wind','Solar Wind at Pluto'), (134,'PEPSSI','Particle Spectrometer','Pluto Energetic Particle Spectrometer Science Investigation'), (135,'REX','Radio Science','Radio Science Experiment'), (136,'SDC','Dust Counter','Student Dust Counter'), (137,'OCAMS','Camera Suite','Osiris-Rex Camera Suite'), (138,'OLA','Laser Altimeter','Osiris-Rex Laser Altimeter'), (139,'OVIRS','Spectrometer','Osiris-Rex Visible and Infrared Spectrometer'), (140,'OTES','Spectrometer','Osiris-Rex Thermal Emission Spectrometer'), (141,'REXIS','X-ray Imager','Regolith X-ray Imaging Spectrometer'), (142,'SSI-Phoenix','Imager','Stereo Imager for Phoenix'), (143,'RA/RAC','Robotic Arm/Camera','Robot Arm and Camera for Phoenix'), (144,'TEGA','Gas Analyzer','Thermal Evolved Gas Analyzer'), (145,'MECA','Compatibility Assessment','Mars Environmental Compatibility Assessment'), (146,'MET','Meteorology Suite','Meteorology Suite for Phoenix'), (147,'GRS&NS','Spectrometers','Gamma-Ray Spectrometer and Neutron Spectrometers'), (148,'DFMI','Dust Monitor','Dust Flux Monitor Instrument'), (149,'NC','Camera','Navigation Camera');

-- Data for: mission_instruments
INSERT INTO `mission_instruments` (`mission_id`, `instrument_id`) VALUES
(1,1),(1,2),(1,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(2,15),(3,16),(3,17),(3,18),(3,19),(4,20),(4,21),(5,22),(5,23),(5,24),(6,25),(6,26),(6,27),(7,28),(7,29),(7,30),(8,31),(8,32),(8,33),(8,34),(8,35),(8,36),(8,37),(8,38),(8,39),(9,40),(9,41),(10,42),(10,43),(11,42),(11,43),(12,44),(12,45),(12,46),(12,47),(12,48),(12,49),(13,50),(13,51),(13,52),(13,53),(13,54),(13,55),(13,56),(13,57),(14,58),(14,59),(14,60),(15,61),(15,62),(15,63),(15,64),(16,3),(16,65),(16,66),(16,6),(16,67),(17,68),(17,69),(17,70),(17,71),(17,72),(17,73),(17,74),(17,75),(18,76),(19,77),(19,78),(20,6),(20,79),(20,80),(20,81),(20,15),(20,82),(21,83),(21,6),(21,84),(21,79),(21,80),(21,78),(21,82),(21,85),(22,86),(22,87),(22,88),(22,89),(22,90),(22,91),(23,92),(23,93),(23,94),(23,95),(23,96),(24,97),(24,98),(24,99),(24,77),(24,100),(24,101),(24,102),(25,103),(25,104),(25,6),(25,18),(25,15),(25,105),(25,106),(25,107),(25,108),(26,109),(26,110),(26,111),(26,88),(26,112),(26,113),(26,15),(27,109),(27,110),(27,111),(27,88),(27,112),(27,113),(27,15),(28,114),(28,115),(28,116),(28,6),(28,117),(28,118),(28,119),(28,15),(29,120),(29,121),(29,122),(29,123),(29,124),(29,125),(29,126),(29,69),(30,127),(30,6),(30,128),(30,129),(30,15),(30,130),(31,131),(31,132),(31,63),(31,133),(31,134),(31,135),(31,136),(32,137),(32,138),(32,139),(32,140),(32,141),(32,15),(33,93),(33,142),(33,143),(33,144),(33,145),(33,146),(34,6),(34,69),(34,147),(35,148),(35,17),(35,149);


-- Data for: researchers
INSERT INTO `researchers` (`researcher_id`, `name`, `affiliation`, `specialty_area`) VALUES
(1001, 'Gordon Pettengill', NULL, NULL), (1002, 'Margaret Kivelson', NULL, NULL), (1003, 'Donald Yeomans', NULL, NULL), (1004, 'Donald Brownlee', NULL, NULL), (1005, 'Michael Malin', NULL, NULL), (1006, 'Philip Christensen', NULL, NULL), (1007, 'Matthew Golombek', NULL, NULL), (1008, 'David Paige', NULL, NULL), (1009, 'William Boynton', NULL, NULL), (1010, 'Linda Spilker', NULL, NULL), (1011, 'Alan Stern', NULL, NULL), (1012, 'Dante Lauretta', NULL, NULL), (1013, 'Bruce Banerdt', NULL, NULL), (1014, 'Scott Bolton', NULL, NULL), (1015, 'Tony Colaprete', NULL, NULL), (1016, 'Hal Levison', NULL, NULL), (1017, 'Alan Binder', NULL, NULL), (1018, 'Ken Farley', NULL, NULL), (1019, 'Sean Solomon', NULL, NULL), (1020, 'Steve Squyres', NULL, NULL), (1021, 'Michael Meyer', NULL, NULL);

-- Data for: mission_researchers
INSERT INTO `mission_researchers` (`mission_id`, `researcher_id`, `role`) VALUES
(18, 1001, 'Lead Investigator'), (8, 1002, 'Lead Investigator'), (30, 1003, 'Lead Investigator'), (7, 1004, 'Lead Investigator'), (21, 1005, 'Lead Investigator'), (20, 1006, 'Lead Investigator'), (22, 1007, 'Lead Investigator'), (23, 1008, 'Lead Investigator'), (1, 1009, 'Lead Investigator'), (2, 1010, 'Lead Investigator'), (31, 1011, 'Lead Investigator'), (32, 1012, 'Lead Investigator'), (12, 1013, 'Lead Investigator'), (13, 1014, 'Lead Investigator'), (14, 1015, 'Lead Investigator'), (15, 1016, 'Lead Investigator'), (16, 1017, 'Lead Investigator'), (17, 1018, 'Lead Investigator'), (28, 1019, 'Lead Investigator'), (26, 1020, 'Lead Investigator'), (29, 1021, 'Lead Investigator');


-- Data for: milestones
INSERT INTO `milestones` (`mission_id`, `event_date`, `milestone_type`, `description`) VALUES
(18, '1989-05-04', 'Launch', 'Magellan launched towards Venus'),
(8, '1989-10-18', 'Launch', 'Galileo launched towards Jupiter'),
(8, '1995-12-07', 'Orbit Insertion', 'Galileo entered Jupiter orbit'),
(30, '1996-02-17', 'Launch', 'NEAR Shoemaker launched'),
(30, '2001-02-12', 'Landing', 'NEAR Shoemaker landed on Eros'),
(7, '1998-10-24', 'Launch', 'Deep Space 1 launched'),
(7, '1999-07-29', 'Flyby', 'Deep Space 1 flyby of asteroid Braille'),
(21, '1992-09-25', 'Launch', 'Mars Observer launched'),
(21, '1993-08-21', 'Contact Lost', 'Mars Observer lost contact'),
(20, '1996-11-07', 'Launch', 'Mars Global Surveyor launched'),
(20, '1997-09-12', 'Orbit Insertion', 'MGS entered Mars orbit'),
(22, '1996-12-04', 'Launch', 'Mars Pathfinder launched'),
(22, '1997-07-04', 'Landing', 'Mars Pathfinder landed with Sojourner'),
(23, '1999-01-03', 'Launch', 'Mars Polar Lander launched'),
(23, '1999-12-03', 'Landing Attempt', 'Mars Polar Lander lost on landing'),
(1, '2001-04-07', 'Launch', '2001 Mars Odyssey launched'),
(1, '2001-10-24', 'Orbit Insertion', 'Odyssey entered Mars orbit'),
(2, '1997-10-15', 'Launch', 'Cassini launched to Saturn'),
(2, '2004-07-01', 'Orbit Insertion', 'Cassini entered Saturn orbit'),
(2, '2005-01-14', 'Probe Landing', 'Huygens landed on Titan'),
(31, '2006-01-19', 'Launch', 'New Horizons launched'),
(31, '2015-07-14', 'Flyby', 'New Horizons Pluto flyby'),
(32, '2016-09-08', 'Launch', 'OSIRIS-REx launched'),
(32, '2020-10-20', 'Sample Collection', 'OSIRIS-REx collected Bennu sample'),
(32, '2023-09-24', 'Sample Return', 'OSIRIS-REx returned sample to Earth'),
(12, '2018-05-05', 'Launch', 'InSight launched to Mars'),
(12, '2018-11-26', 'Landing', 'InSight landed on Mars'),
(13, '2011-08-05', 'Launch', 'Juno launched to Jupiter'),
(13, '2016-07-04', 'Orbit Insertion', 'Juno entered Jupiter orbit'),
(14, '2013-09-07', 'Launch', 'LADEE launched'),
(15, '2021-10-16', 'Launch', 'Lucy launched'),
(16, '1998-01-06', 'Launch', 'Lunar Prospector launched'),
(17, '2020-07-30', 'Launch', 'Mars 2020 Perseverance launched'),
(17, '2021-02-18', 'Landing', 'Perseverance landed in Jezero Crater'),
(19, '1998-12-11', 'Launch', 'Mars Climate Orbiter launched'),
(19, '1999-09-23', 'Loss', 'Mars Climate Orbiter lost due to error'),
(24, '2005-08-12', 'Launch', 'MRO launched'),
(24, '2006-03-10', 'Orbit Insertion', 'MRO entered Mars orbit'),
(25, '2013-11-18', 'Launch', 'MAVEN launched'),
(25, '2014-09-22', 'Orbit Insertion', 'MAVEN entered Mars orbit'),
(26, '2003-06-10', 'Launch', 'Spirit launched'),
(26, '2004-01-04', 'Landing', 'Spirit landed on Mars'),
(27, '2003-07-08', 'Launch', 'Opportunity launched'),
(27, '2004-01-25', 'Landing', 'Opportunity landed on Mars'),
(28, '2004-08-03', 'Launch', 'MESSENGER launched'),
(28, '2011-03-18', 'Orbit Insertion', 'MESSENGER entered Mercury orbit'),
(29, '2011-11-26', 'Launch', 'MSL Curiosity launched'),
(29, '2012-08-06', 'Landing', 'Curiosity landed on Mars'),
(33, '2007-08-04', 'Launch', 'Phoenix launched'),
(33, '2008-05-25', 'Landing', 'Phoenix landed on Mars'),
(34, '2023-10-13', 'Launch', 'Psyche launched'),
(35, '1999-02-07', 'Launch', 'Stardust launched'),
(35, '2006-01-15', 'Sample Return', 'Stardust returned comet samples');

-- Feature: Stored Procedure
DELIMITER //
CREATE PROCEDURE AvgMissionCost(IN mid INT)
BEGIN
  SELECT mission_id, AVG(cost_pcepi) AS avg_cost
  FROM budget_records
  WHERE mission_id = mid
  GROUP BY mission_id;
END;
//
DELIMITER ;


-- Feature: View
CREATE VIEW vw_successful_mission_summary AS
SELECT
    m.name AS mission_name,
    m.launch_date,
    m.destination_planet,
    lv.name AS launch_vehicle,
    br.cost_then AS budget_millions
FROM missions AS m
JOIN mission_launch AS ml ON m.mission_id = ml.mission_id
JOIN launch_vehicles AS lv ON ml.vehicle_id = lv.vehicle_id
JOIN budget_records AS br ON m.mission_id = br.mission_id
WHERE m.mission_status IN ('Completed', 'Success', 'Operational');

-- Feature: Trigger
DELIMITER //
CREATE TRIGGER after_mission_insert
AFTER INSERT ON missions
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, operation, record_pk, performed_by)
    VALUES ('missions', 'INSERT', NEW.mission_id, USER());
END;
//
DELIMITER ;

-- Feature: Indexing Examples
CREATE INDEX idx_destination ON missions(destination_planet);
CREATE INDEX idx_launch_date ON missions(launch_date);


-- DATA ANALYSIS QUERIES
-- Query 1: Mission Success Rate by Destination Planet
SELECT
    destination_planet,
    COUNT(mission_id) AS total_missions,
    SUM(CASE WHEN mission_status IN ('Success', 'Completed', 'Operational') THEN 1 ELSE 0 END) AS successful_missions,
    CAST(SUM(CASE WHEN mission_status IN ('Success', 'Completed', 'Operational') THEN 1 ELSE 0 END) AS DECIMAL(10,4)) / COUNT(mission_id) AS success_rate
FROM
    missions
GROUP BY
    destination_planet
ORDER BY
    success_rate DESC, total_missions DESC;

-- Query 2: Average Duration & Budget for Successful Missions by Mission Type
SELECT
    m.mission_type,
    COUNT(m.mission_id) AS total_successful_missions,
    AVG(m.duration_days) AS avg_duration_days,
    AVG(br.cost_then) AS avg_cost_millions
FROM
    missions AS m
JOIN
    budget_records AS br ON m.mission_id = br.mission_id
WHERE
    m.mission_status IN ('Success', 'Completed', 'Operational')
GROUP BY
    m.mission_type
HAVING
    COUNT(m.mission_id) > 1
ORDER BY
    avg_duration_days DESC;

-- Query 3: Top 3 Most Used & Reliable Launch Vehicles
SELECT
    lv.name AS launch_vehicle_name,
    COUNT(ml.id) AS total_launches,
    SUM(CASE WHEN ml.launch_success = 1 THEN 1 ELSE 0 END) AS successful_launches,
    CAST(SUM(CASE WHEN ml.launch_success = 1 THEN 1 ELSE 0 END) AS DECIMAL(10,4)) / COUNT(ml.id) AS success_rate
FROM
    launch_vehicles AS lv
JOIN
    mission_launch AS ml ON lv.vehicle_id = ml.vehicle_id
GROUP BY
    lv.name
ORDER BY
    success_rate DESC, total_launches DESC
LIMIT 3;