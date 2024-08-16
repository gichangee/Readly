-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: readly
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `timecapsule_items` 
--



INSERT INTO `timecapsule_items` (`id`, `timecapsule_id`, `photocard_id`, `review_id`, `item_type`) VALUES 
(1, NULL, 11, NULL, 'P'),
(2, NULL, 11, NULL, 'P'),
(3, NULL, 4, NULL, 'P'),
(4, NULL, 4, NULL, 'P'),
(5, NULL, 20, NULL, 'P'),
(6, NULL, 20, NULL, 'P'),
(7, NULL, 18, NULL, 'P'),
(8, NULL, 18, NULL, 'P'),
(9, 1, NULL, 16, 'R'),
(10, 1, NULL, 88, 'R'),
(11, 1, 20, NULL, 'P'),
(12, 2, NULL, 20, 'R'),
(13, 2, NULL, 29, 'R'),
(14, 2, NULL, 83, 'R'),
(15, 2, 16, NULL, 'P'),
(16, 3, NULL, 27, 'R'),
(17, 3, 14, NULL, 'P'),
(18, 4, NULL, 25, 'R'),
(19, 4, NULL, 82, 'R'),
(20, 4, 18, NULL, 'P'),
(21, 5, NULL, 21, 'R'),
(22, 5, NULL, 30, 'R'),
(23, 5, 13, NULL, 'P'),
(24, 6, NULL, 18, 'R'),
(25, 6, NULL, 95, 'R'),
(26, 7, NULL, 15, 'R'),
(27, 7, NULL, 90, 'R'),
(28, 7, 15, NULL, 'P'),
(29, 8, NULL, 42, 'R'),
(30, 8, NULL, 58, 'R'),
(31, 8, 21, NULL, 'P'),
(32, 9, NULL, 36, 'R'),
(33, 9, NULL, 44, 'R'),
(34, 9, NULL, 97, 'R'),
(35, 9, 17, NULL, 'P'),
(36, 10, NULL, 23, 'R'),
(37, 10, NULL, 91, 'R'),
(38, 11, NULL, 13, 'R'),
(39, 11, NULL, 70, 'R'),
(40, 11, 19, NULL, 'P'),
(41, 12, NULL, 19, 'R'),
(42, 12, NULL, 32, 'R'),
(43, 13, NULL, 16, 'R'),
(44, 13, NULL, 88, 'R'),
(45, 13, 20, NULL, 'P'),
(46, 14, NULL, 16, 'R'),
(47, 14, NULL, 33, 'R'),
(48, 14, 20, NULL, 'P'),
(49, 15, NULL, 48, 'R'),
(50, 15, NULL, 66, 'R'),
(51, 15, 20, NULL, 'P'),
(52, 16, 22, NULL, 'P'),
(53, 16, NULL,101, 'R');
