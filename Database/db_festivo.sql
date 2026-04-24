-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 24, 2026 at 03:00 PM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_festivo`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_assign`
--

DROP TABLE IF EXISTS `tbl_assign`;
CREATE TABLE IF NOT EXISTS `tbl_assign` (
  `assgin_id` int NOT NULL AUTO_INCREMENT,
  `competition_id` int NOT NULL,
  `coordinator_id` int NOT NULL,
  PRIMARY KEY (`assgin_id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_assign`
--

INSERT INTO `tbl_assign` (`assgin_id`, `competition_id`, `coordinator_id`) VALUES
(7, 15, 3),
(8, 16, 6),
(9, 15, 8),
(10, 20, 2),
(11, 19, 1),
(13, 21, 9);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_category`
--

DROP TABLE IF EXISTS `tbl_category`;
CREATE TABLE IF NOT EXISTS `tbl_category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_image` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_category`
--

INSERT INTO `tbl_category` (`category_id`, `category_name`, `category_description`, `category_image`) VALUES
(12, 'Cultural', 'This is about cultural', '1773464600326-cultural.jpg'),
(2, 'Technical Fest ', 'This category includes Coding competitions, Hackathons, Robotics fest, Tech expos, Paper presentations', ''),
(3, 'Gaming Fests', 'It includes Esports tournaments, LAN gaming fest, Mobile gaming fest, Retro games fest', '');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_competitionreg`
--

DROP TABLE IF EXISTS `tbl_competitionreg`;
CREATE TABLE IF NOT EXISTS `tbl_competitionreg` (
  `competitionregid` int NOT NULL AUTO_INCREMENT,
  `competitionid` int NOT NULL,
  `chessno` int NOT NULL,
  `attendance` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `regdate` date NOT NULL,
  `participantid` int NOT NULL,
  PRIMARY KEY (`competitionregid`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_competitionreg`
--

INSERT INTO `tbl_competitionreg` (`competitionregid`, `competitionid`, `chessno`, `attendance`, `regdate`, `participantid`) VALUES
(1, 15, 101, 'present', '2026-04-24', 12),
(2, 16, 0, 'absent', '2026-04-24', 12),
(3, 15, 102, 'present', '2026-04-24', 1),
(4, 16, 0, 'absent', '2026-04-24', 1),
(5, 17, 0, 'absent', '2026-04-24', 1),
(6, 18, 0, 'absent', '2026-04-24', 1),
(7, 20, 0, 'absent', '2026-04-24', 6),
(8, 19, 0, 'absent', '2026-04-24', 6),
(9, 17, 0, 'absent', '2026-04-24', 6),
(10, 18, 0, 'absent', '2026-04-24', 6),
(11, 15, 103, 'present', '2026-04-24', 2),
(12, 16, 0, 'absent', '2026-04-24', 2),
(13, 19, 0, 'absent', '2026-04-24', 2),
(14, 20, 0, 'absent', '2026-04-24', 2),
(16, 20, 0, 'absent', '2026-04-24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_competitions`
--

DROP TABLE IF EXISTS `tbl_competitions`;
CREATE TABLE IF NOT EXISTS `tbl_competitions` (
  `competition_id` int NOT NULL AUTO_INCREMENT,
  `competition_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `competition_date` date NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_members` int NOT NULL,
  `min_members` int NOT NULL,
  `grouplimit` int NOT NULL,
  `fest_id` int NOT NULL,
  `reg_fee` int NOT NULL,
  `reg_date` date NOT NULL,
  `res_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`competition_id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_competitions`
--

INSERT INTO `tbl_competitions` (`competition_id`, `competition_name`, `image`, `competition_date`, `description`, `type`, `max_members`, `min_members`, `grouplimit`, `fest_id`, `reg_fee`, `reg_date`, `res_status`) VALUES
(18, 'E-Football', '1776968050071-pes.webp', '2026-04-29', 'An eFootball (PES) competition tests players’ strategy, control, and tactical skills in virtual football matches, delivering an exciting and competitive gaming experience.', 'single', 1, 1, 14, 2, 100, '2026-04-23', 'pending'),
(17, 'PUBG', '1776967973092-pubg.png', '2026-04-28', 'A PUBG competition challenges players’ teamwork, strategy, and survival skills in intense battle royale matches, delivering thrilling and competitive gaming experiences.', 'single', 1, 1, 20, 2, 499, '2026-04-23', 'pending'),
(16, 'Nacho', '1776965812327-dance.jpg', '2026-04-25', 'A dance competition showcases talent, creativity, and expression through energetic performances, where participants compete to impress judges with skill and rhythm.', 'group', 4, 2, 10, 1, 500, '2026-04-23', 'pending'),
(15, 'Coding Competition', '1776963970312-coding.jpg', '2026-04-25', 'A coding competition tests problem-solving and programming skills through challenging tasks, encouraging speed, accuracy, and logical thinking among participants.', 'single', 1, 1, 20, 1, 299, '2026-04-23', 'published'),
(19, 'Treasure hunt', '1776968985696-treasure_hunt.jpg', '2026-04-29', 'A treasure hunt is an adventurous competition where participants solve clues and complete challenges to find hidden items, testing teamwork, creativity, and problem-solving skills.', 'group', 6, 3, 15, 4, 600, '2026-04-23', 'pending'),
(20, 'Typing competition', '1776969153838-typing_competition.jpg', '2026-04-29', 'A typing speed competition tests participants’ accuracy and speed in typing text within a time limit, highlighting focus, precision, and keyboard skills.', 'single', 1, 1, 15, 4, 299, '2026-04-24', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_competition_group_details`
--

DROP TABLE IF EXISTS `tbl_competition_group_details`;
CREATE TABLE IF NOT EXISTS `tbl_competition_group_details` (
  `detailid` int NOT NULL AUTO_INCREMENT,
  `participantname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `collegeidproof` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_no` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `competitionregid` int NOT NULL,
  PRIMARY KEY (`detailid`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_competition_group_details`
--

INSERT INTO `tbl_competition_group_details` (`detailid`, `participantname`, `collegeidproof`, `contact_no`, `email`, `competitionregid`) VALUES
(1, 'Sanusha', '1776971204527-licences.webp', '1242342424', 'sanusha@gmail.com', 2),
(2, 'Reena TJ', '1776971486420-licences.webp', '7737715794', 'reena@gmail.com', 4),
(3, 'Alain', '1776971706079-licences.webp', '1241241241', 'alain@gmail.com', 8),
(4, 'Ashitha', '1776971706081-licences.webp', '9944994949', 'ashitha@gmail.com', 8),
(5, 'Geovany', '1776971860163-licences.webp', '9947319580', 'geo@gmail.com', 12),
(6, 'teamate1', '1776971951274-licences.webp', '1111111111', 'team1@gmail.com', 13),
(7, 'teamate2', '1776971951275-licences.webp', '1123424242', 'teamate3@gmail.com', 13);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_coordinators`
--

DROP TABLE IF EXISTS `tbl_coordinators`;
CREATE TABLE IF NOT EXISTS `tbl_coordinators` (
  `coordinator_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_no` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_id` int NOT NULL,
  `image` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `login_id` int NOT NULL,
  PRIMARY KEY (`coordinator_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_coordinators`
--

INSERT INTO `tbl_coordinators` (`coordinator_id`, `name`, `email`, `contact_no`, `institution_id`, `image`, `login_id`) VALUES
(1, 'Jeril Babu', 'jerilbabu152@gmail.com', '8086596190', 2, '', 3),
(2, 'Sani Tomy', 'sani@gmail.com', '1122334455', 2, '', 4),
(8, 'Kefin Benny', 'kefin@gmail.com', '9988778899', 1, '1776966237003-man3.webp', 25),
(6, 'Rahul S', 'rahull@gmail.com', '2341321344', 1, '1773578412063-man2.jpg', 16);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_coordinator_tasks`
--

DROP TABLE IF EXISTS `tbl_coordinator_tasks`;
CREATE TABLE IF NOT EXISTS `tbl_coordinator_tasks` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `coordinator_id` int NOT NULL,
  `fest_id` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` enum('low','medium','high') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `due_date` date NOT NULL,
  `status` enum('pending','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`),
  KEY `coordinator_id` (`coordinator_id`),
  KEY `fest_id` (`fest_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_coordinator_tasks`
--

INSERT INTO `tbl_coordinator_tasks` (`task_id`, `coordinator_id`, `fest_id`, `title`, `priority`, `due_date`, `status`, `created_at`) VALUES
(1, 3, 1, 'Finalize Venue Layout for Zenith', 'high', '2026-04-26', 'pending', '2026-04-23 20:09:16'),
(2, 3, 1, 'Confirm Speaker List', 'medium', '2026-04-29', 'pending', '2026-04-23 20:09:16'),
(3, 3, 1, 'Order Event T-Shirts', 'low', '2026-04-24', 'completed', '2026-04-23 20:09:16');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fests`
--

DROP TABLE IF EXISTS `tbl_fests`;
CREATE TABLE IF NOT EXISTS `tbl_fests` (
  `fest_id` int NOT NULL AUTO_INCREMENT,
  `fest_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fest_image` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `brochure` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `startdate` date NOT NULL,
  `enddate` date NOT NULL,
  `fest_description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fest_for` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_id` int NOT NULL,
  `category_id` int NOT NULL,
  `reg_date` date NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `result_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  PRIMARY KEY (`fest_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_fests`
--

INSERT INTO `tbl_fests` (`fest_id`, `fest_name`, `fest_image`, `brochure`, `startdate`, `enddate`, `fest_description`, `fest_for`, `institution_id`, `category_id`, `reg_date`, `status`, `result_status`) VALUES
(1, 'Zenith', '1776963786254-zenith2.jpg', '', '2026-04-25', '2026-04-26', 'Zenith is an exciting college fest that brings together talent, creativity, and innovation. It features a variety of events including cultural performances, technical competitions, and fun activities, offering students a platform to showcase their skills, collaborate, and create unforgettable memories.', 'all', 1, 12, '2026-04-23', 'active', 'pending'),
(2, 'Aloki', '1776967399128-aloki.webp', '', '2026-04-27', '2026-04-30', 'Aloki is a vibrant college fest celebrating creativity, talent, and togetherness. It features cultural performances, technical events, and fun competitions, providing students an exciting platform to express themselves, connect with others, and create memorable experiences.', 'college students', 3, 3, '2026-04-23', 'active', 'pending'),
(4, 'Experia', '1776968829062-experia.jpg', '', '2026-04-28', '2026-04-30', 'Experia is a dynamic college fest that blends innovation, creativity, and entertainment. It features technical events, cultural performances, and fun competitions, offering students a platform to explore talents, collaborate, and enjoy an engaging and memorable fest experience.', 'school students', 2, 2, '2026-04-23', 'active', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fest_coordinators`
--

DROP TABLE IF EXISTS `tbl_fest_coordinators`;
CREATE TABLE IF NOT EXISTS `tbl_fest_coordinators` (
  `coord_id` int NOT NULL AUTO_INCREMENT,
  `fest_id` int NOT NULL,
  `coord_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coord_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coord_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`coord_id`),
  KEY `fest_id` (`fest_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_guest_contact`
--

DROP TABLE IF EXISTS `tbl_guest_contact`;
CREATE TABLE IF NOT EXISTS `tbl_guest_contact` (
  `contact_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_no` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`contact_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_guest_contact`
--

INSERT INTO `tbl_guest_contact` (`contact_id`, `name`, `email`, `phone_no`, `subject`, `message`, `status`) VALUES
(4, 'Shajahan', 'sample @gmail.com', '1234567890', 'sample', 'sample message is sending to the admin', 'unreaded'),
(5, 'Yaseen Basheer', 'asdfas', '1234123412', 'asdfalkgj', 'jaslkdfj ;lkgj akl;sdjf kladfak gj;alksd f', 'unreaded'),
(6, 'Yaseen Basheer', 'asdfas', '1234123412', 'asdfalkgj', 'gjhgjhgkjhgl', 'readed'),
(7, 'Yaseen Basheer', 'asdfas', '1234123412', 'asdfalkgj', 'hljhliyuioupoi', 'readed'),
(12, 'Sani Tomy', 'sani@gmail.com', '9944332299', 'I can\'t login', 'When  i try to login, a popup shows that \"Your account is inactive\". Please fix it.', 'unreaded');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_institution`
--

DROP TABLE IF EXISTS `tbl_institution`;
CREATE TABLE IF NOT EXISTS `tbl_institution` (
  `institution_id` int NOT NULL AUTO_INCREMENT,
  `institution_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_contactno` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_image` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `login_id` int NOT NULL,
  `websiteaddress` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_maps_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`institution_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_institution`
--

INSERT INTO `tbl_institution` (`institution_id`, `institution_name`, `institution_address`, `institution_email`, `institution_contactno`, `institution_image`, `login_id`, `websiteaddress`, `latitude`, `longitude`, `google_maps_link`) VALUES
(1, 'Santhigiri College Of Computer Sciences', 'santhigiri college near vazhithala, thodupuzha, idukki', 'santhigiri@gmail.com', '8086596190', 'santhigiri.webp', 2, '', NULL, NULL, NULL),
(2, 'Nirmala College ', 'alsjflaks flkajs flaksj flkasj flkasj flask ', 'nirmala@gmail.com', '29329342948', 'nirmala.jfif', 6, '', NULL, NULL, NULL),
(3, 'Iahiya college', 'Thodupuzha', 'shajahan1backup@gmail.com', '7736715794', '1773460986787-ilahiya.jpg', 14, 'http://icas.ac.in/', '9.8976798', '76.7134225', 'https://maps.app.goo.gl/aAoicjmjQ8E1yBf58'),
(10, 'Government college of idukki', 'kattappana, idukki', 'bca2326_shajahanbasheer@santhigiricollege.com', '9947525494', '1776978350173-inst.webp', 31, 'https://www.gecidukki.ac.in/', '9.7433904', '77.109705', 'https://maps.app.goo.gl/M2mTB6o5ps4Pvi3CA');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_login`
--

DROP TABLE IF EXISTS `tbl_login`;
CREATE TABLE IF NOT EXISTS `tbl_login` (
  `login_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`login_id`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_login`
--

INSERT INTO `tbl_login` (`login_id`, `username`, `password`, `role`, `status`) VALUES
(1, 'Admin', 'Admin123', 'admin', 'active'),
(2, 'santhi123', 'santhi123', 'Institution', 'active'),
(3, 'jeril', 'asdfgh', 'coordinator', 'active'),
(4, 'sani', 'asdfgh', 'coordinator', 'inactive'),
(5, 'shajahan', 'asdfgh', 'Participant', 'active'),
(6, 'nirmala', 'asdfgh', 'Institution', 'active'),
(25, 'kefin', 'asdfgh', 'Coordinator', 'active'),
(8, 'jaya', 'asdfgh', 'Participant', 'active'),
(14, 'ilahiya', 'asdfgh', 'Institution', 'active'),
(12, 'thahir', 'asdfgh', 'Participant', 'active'),
(16, 'rahull', 'asdfgh', 'Coordinator', 'active'),
(17, 'anand', 'asdfgh', 'Participant', 'active'),
(31, 'gov', 'asdfgh', 'Institution', 'active'),
(28, 'siril', 'asdfgh', 'Participant', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_participant`
--

DROP TABLE IF EXISTS `tbl_participant`;
CREATE TABLE IF NOT EXISTS `tbl_participant` (
  `participantid` int NOT NULL AUTO_INCREMENT,
  `participantname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `participantemail` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_no` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `participantimage` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `loginid` int NOT NULL,
  `academic_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_id_proof` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`participantid`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_participant`
--

INSERT INTO `tbl_participant` (`participantid`, `participantname`, `participantemail`, `contact_no`, `participantimage`, `loginid`, `academic_status`, `institution_name`, `institution_id_proof`) VALUES
(1, 'Shajahan Basheer', 'shajahan@gmail.com', '9947525494', 'shajahan.jpeg', 5, 'all', 'Santhigiri College ', '1773859372486-ShajahanBasheer.pdf'),
(2, 'Jayasankar K N', 'jaya@gmail.com', '12345678900', 'jayasankar.jpeg', 8, 'college student', 'ABC college', '1773859372486-ShajahanBasheer.pdf'),
(6, 'Thahir Basheer', 'shajahan1rockzz@gmail.com', '7736715794', '1773460332236-main1.jpg', 12, 'College Student', 'Santhigiri College of computer sciences', '1773460332235-id_proof1.jpg'),
(12, 'Siril Sabu', 'sirilsabu8@gmail.com', '9947319580', '1776970192559-siril.jpg', 28, 'School Student', 'Santhigiri College of computer sciences', '1776970192559-licences.pdf'),
(9, 'Anand Jeo Nedukallel', 'shajahan3backup@gmail.com', '7737272725', '1773859372488-sports1.jpg', 23, 'School Student', 'MKNMHSS', '1773859372486-ShajahanBasheer.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_payment`
--

DROP TABLE IF EXISTS `tbl_payment`;
CREATE TABLE IF NOT EXISTS `tbl_payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `payment_date` date NOT NULL,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeid` int NOT NULL,
  `amount` int NOT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_payment`
--

INSERT INTO `tbl_payment` (`payment_id`, `payment_date`, `type`, `typeid`, `amount`) VALUES
(39, '2026-04-24', 'registration', 15, 299),
(38, '2026-04-24', 'subscription', 11, 2999),
(23, '2026-04-23', 'subscription', 2, 2000),
(21, '2026-04-23', 'subscription', 3, 2000),
(20, '2026-04-23', 'subscription', 1, 2999),
(22, '2026-04-23', 'subscription', 3, 2000),
(25, '2026-04-24', 'registration', 2, 500),
(26, '2026-04-24', 'registration', 3, 299),
(27, '2026-04-24', 'registration', 4, 500),
(28, '2026-04-24', 'registration', 5, 499),
(29, '2026-04-24', 'registration', 6, 100),
(30, '2026-04-24', 'registration', 7, 299),
(31, '2026-04-24', 'registration', 8, 600),
(32, '2026-04-24', 'registration', 9, 499),
(33, '2026-04-24', 'registration', 10, 100),
(34, '2026-04-24', 'registration', 11, 299),
(35, '2026-04-24', 'registration', 12, 500),
(36, '2026-04-24', 'registration', 13, 600),
(40, '2026-04-24', 'registration', 16, 299);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_plan`
--

DROP TABLE IF EXISTS `tbl_plan`;
CREATE TABLE IF NOT EXISTS `tbl_plan` (
  `plan_id` int NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `days` int NOT NULL,
  `amount` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`plan_id`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_plan`
--

INSERT INTO `tbl_plan` (`plan_id`, `plan_name`, `days`, `amount`, `description`) VALUES
(1, 'One Week', 7, '2000', 'This plan will give you access for 7 days'),
(28, 'Basic', 19, '2999', 'This is a basic plan.'),
(3, 'Premium', 150, '9999', 'You will get access for 150 days, you can host many fests you want.'),
(4, 'Enterprise', 365, '15999', 'This plan will give you access for 1 year.');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_result`
--

DROP TABLE IF EXISTS `tbl_result`;
CREATE TABLE IF NOT EXISTS `tbl_result` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `competition_id` int NOT NULL,
  `competition_reg_id` int NOT NULL,
  `position` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`result_id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_result`
--

INSERT INTO `tbl_result` (`result_id`, `competition_id`, `competition_reg_id`, `position`) VALUES
(15, 15, 3, '2'),
(14, 15, 1, '1'),
(18, 15, 11, '3');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_subscription`
--

DROP TABLE IF EXISTS `tbl_subscription`;
CREATE TABLE IF NOT EXISTS `tbl_subscription` (
  `subscriptionid` int NOT NULL AUTO_INCREMENT,
  `planid` int NOT NULL,
  `institutionid` int NOT NULL,
  `renewaldate` date NOT NULL,
  `subscriptiondate` date NOT NULL,
  PRIMARY KEY (`subscriptionid`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_subscription`
--

INSERT INTO `tbl_subscription` (`subscriptionid`, `planid`, `institutionid`, `renewaldate`, `subscriptiondate`) VALUES
(5, 28, 1, '2026-03-29', '2026-03-14'),
(6, 28, 1, '2026-05-08', '2026-04-23'),
(8, 1, 3, '2026-04-30', '2026-04-23'),
(9, 1, 2, '2026-04-30', '2026-04-23');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
