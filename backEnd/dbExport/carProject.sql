-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 23, 2016 at 04:17 AM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carProject`
--

-- --------------------------------------------------------

--
-- Table structure for table `Appointment`
--

CREATE TABLE `Appointment` (
  `ApptID` int(11) NOT NULL,
  `CustVehicleID` int(11) NOT NULL,
  `TechID` int(11) NOT NULL,
  `ApptDate` date NOT NULL,
  `ApptTime` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Appointment`
--

INSERT INTO `Appointment` (`ApptID`, `CustVehicleID`, `TechID`, `ApptDate`, `ApptTime`) VALUES
(96, 85, 4, '2016-11-23', 9);

-- --------------------------------------------------------

--
-- Table structure for table `Customer`
--

CREATE TABLE `Customer` (
  `CustID` int(11) NOT NULL,
  `CustFirstName` text NOT NULL,
  `CustLastName` text NOT NULL,
  `CustEmail` text NOT NULL,
  `CustPassword` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Customer`
--

INSERT INTO `Customer` (`CustID`, `CustFirstName`, `CustLastName`, `CustEmail`, `CustPassword`) VALUES
(39, 'Sorin', 'Badila', 'sfbadila@oakland.edu', '$2a$10$2pue8UkToY/dqotJLO3ivOgzW4eh1EuSRgB2L0V8YwV0KJx6AgBwm'),
(40, 'test', 'test', 'test@localhost.com', '$2a$10$2pue8UkToY/dqotJLO3ivOgzW4eh1EuSRgB2L0V8YwV0KJx6AgBwm'),
(41, 'C-Skillet', 'Woods', 'C-skillet@fakeemail.com', '$2a$10$2pue8UkToY/dqotJLO3ivO/bDKMisRZFrSSJfK1vLeqhKLXfQ3fte'),
(42, 'Billy ', 'Joe', 'test', '$2a$10$2pue8UkToY/dqotJLO3ivOHU7uaK/N9z9lBcyn/zNqix0elb8AyPq'),
(43, 'Sorin2', 'Badila2', 'sbadilaIsAwesome', '$2a$10$2pue8UkToY/dqotJLO3ivOgzW4eh1EuSRgB2L0V8YwV0KJx6AgBwm'),
(44, 'tq', 't', 'tt', '$2a$10$2pue8UkToY/dqotJLO3ivOgzW4eh1EuSRgB2L0V8YwV0KJx6AgBwm'),
(45, 'a', 'a', 'aa', 'tester'),
(46, 't', 't', 'aaa', '$2a$10$2pue8UkToY/dqotJLO3ivOgzW4eh1EuSRgB2L0V8YwV0KJx6AgBwm'),
(47, 'tester', 'testerAgain', 'sorin.badila@yahoo.com', '$2a$10$2pue8UkToY/dqotJLO3ivOgzW4eh1EuSRgB2L0V8YwV0KJx6AgBwm'),
(48, 'y', 'tt', 'y', '$2a$10$2pue8UkToY/dqotJLO3ivOnYKpKqSAfn0H8VMRuITo3STlr25mlX.');

-- --------------------------------------------------------

--
-- Table structure for table `CustomerVehicles`
--

CREATE TABLE `CustomerVehicles` (
  `CustVehicleID` int(11) NOT NULL,
  `CustID` int(11) NOT NULL,
  `VehicleID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `CustomerVehicles`
--

INSERT INTO `CustomerVehicles` (`CustVehicleID`, `CustID`, `VehicleID`) VALUES
(76, 39, 1),
(67, 39, 2),
(68, 39, 3),
(69, 39, 4),
(84, 39, 5),
(70, 39, 6),
(71, 39, 7),
(74, 39, 8),
(75, 39, 10),
(73, 44, 1),
(78, 46, 3),
(77, 46, 5),
(80, 46, 6),
(83, 46, 9),
(79, 46, 10),
(85, 47, 7),
(86, 48, 5);

-- --------------------------------------------------------

--
-- Table structure for table `ServiceRecommendation`
--

CREATE TABLE `ServiceRecommendation` (
  `SRID` int(11) NOT NULL,
  `VehicleID` int(11) NOT NULL,
  `ServiceID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ServiceRecommendation`
--

INSERT INTO `ServiceRecommendation` (`SRID`, `VehicleID`, `ServiceID`) VALUES
(1, 1, 3),
(2, 1, 2),
(3, 4, 1),
(4, 2, 1),
(5, 3, 1),
(6, 5, 1),
(7, 6, 1),
(8, 7, 1),
(9, 8, 1),
(10, 9, 1),
(11, 10, 1),
(12, 2, 2),
(13, 4, 1),
(14, 4, 2),
(19, 2, 4),
(20, 3, 4),
(21, 5, 4),
(22, 6, 4),
(23, 7, 4),
(24, 8, 4),
(25, 9, 4),
(26, 10, 4),
(27, 1, 5),
(28, 4, 5),
(29, 7, 5),
(30, 10, 5),
(31, 2, 6),
(32, 5, 6),
(33, 7, 6),
(34, 8, 6),
(35, 9, 6),
(36, 1, 7),
(37, 3, 7),
(38, 5, 7),
(39, 8, 7),
(40, 10, 7),
(41, 8, 5);

-- --------------------------------------------------------

--
-- Table structure for table `Services`
--

CREATE TABLE `Services` (
  `ServiceID` int(11) NOT NULL,
  `Service` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Services`
--

INSERT INTO `Services` (`ServiceID`, `Service`) VALUES
(1, 'Oil Change'),
(2, 'Wheel alignment'),
(3, 'Ignition switch replacement'),
(4, 'Tire rotation'),
(5, 'Spark plug replacement'),
(6, 'Fuel filter replacement'),
(7, 'Brake replacement');

-- --------------------------------------------------------

--
-- Table structure for table `Technician`
--

CREATE TABLE `Technician` (
  `TechID` int(11) NOT NULL,
  `TechFirstName` text NOT NULL,
  `TechLastName` text NOT NULL,
  `D1` text NOT NULL,
  `D2` text NOT NULL,
  `D3` text NOT NULL,
  `D4` text NOT NULL,
  `D5` text NOT NULL,
  `D6` text NOT NULL,
  `D7` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Technician`
--

INSERT INTO `Technician` (`TechID`, `TechFirstName`, `TechLastName`, `D1`, `D2`, `D3`, `D4`, `D5`, `D6`, `D7`) VALUES
(3, 'John', 'Doe', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000'),
(4, 'Montgomery', 'Scott', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000');

-- --------------------------------------------------------

--
-- Table structure for table `Vehicles`
--

CREATE TABLE `Vehicles` (
  `VehicleID` int(11) NOT NULL,
  `VehicleMake` text NOT NULL,
  `VehicleModel` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Vehicles`
--

INSERT INTO `Vehicles` (`VehicleID`, `VehicleMake`, `VehicleModel`) VALUES
(1, 'Chevrolet', 'Cobalt'),
(2, 'Chevrolet', 'Cruze'),
(3, 'Ford', 'Focus'),
(4, 'Ford', 'Fiesta'),
(5, 'Volvo', 'V60'),
(6, 'Volkswagen', 'Passat'),
(7, 'Volkswagen', 'Jetta'),
(8, 'Audi', 'A5'),
(9, 'Audi', 'A3'),
(10, 'Audi', 'S6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Appointment`
--
ALTER TABLE `Appointment`
  ADD PRIMARY KEY (`ApptID`);

--
-- Indexes for table `Customer`
--
ALTER TABLE `Customer`
  ADD PRIMARY KEY (`CustID`);

--
-- Indexes for table `CustomerVehicles`
--
ALTER TABLE `CustomerVehicles`
  ADD PRIMARY KEY (`CustVehicleID`),
  ADD UNIQUE KEY `CustID` (`CustID`,`VehicleID`);

--
-- Indexes for table `ServiceRecommendation`
--
ALTER TABLE `ServiceRecommendation`
  ADD PRIMARY KEY (`SRID`);

--
-- Indexes for table `Services`
--
ALTER TABLE `Services`
  ADD PRIMARY KEY (`ServiceID`);

--
-- Indexes for table `Technician`
--
ALTER TABLE `Technician`
  ADD PRIMARY KEY (`TechID`);

--
-- Indexes for table `Vehicles`
--
ALTER TABLE `Vehicles`
  ADD PRIMARY KEY (`VehicleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Appointment`
--
ALTER TABLE `Appointment`
  MODIFY `ApptID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;
--
-- AUTO_INCREMENT for table `Customer`
--
ALTER TABLE `Customer`
  MODIFY `CustID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
--
-- AUTO_INCREMENT for table `CustomerVehicles`
--
ALTER TABLE `CustomerVehicles`
  MODIFY `CustVehicleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;
--
-- AUTO_INCREMENT for table `ServiceRecommendation`
--
ALTER TABLE `ServiceRecommendation`
  MODIFY `SRID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT for table `Services`
--
ALTER TABLE `Services`
  MODIFY `ServiceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `Technician`
--
ALTER TABLE `Technician`
  MODIFY `TechID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `Vehicles`
--
ALTER TABLE `Vehicles`
  MODIFY `VehicleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
