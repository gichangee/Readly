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
-- Dumping data for table `group_members`
--
INSERT INTO `group_members` (`member_id`, `group_id`, `role`)
VALUES 
-- Group 1 (current_participants: 2)
(1, 1, 'L'),
(2, 1, 'M'),

-- Group 2 (current_participants: 2)
(3, 2, 'L'),
(4, 2, 'M'),

-- Group 3 (current_participants: 3)
(5, 3, 'L'),
(6, 3, 'M'),
(7, 3, 'M'),

-- Group 4 (current_participants: 4)
(8, 4, 'L'),
(9, 4, 'M'),
(10, 4, 'M'),
(11, 4, 'M'),

-- Group 5 (current_participants: 5)
(12, 5, 'L'),
(1, 5, 'M'),
(2, 5, 'M'),
(3, 5, 'M'),
(4, 5, 'M'),

-- Group 6 (current_participants: 6)
(5, 6, 'L'),
(6, 6, 'M'),
(7, 6, 'M'),
(8, 6, 'M'),
(9, 6, 'M'),
(10, 6, 'M'),

-- Group 7 (current_participants: 7)
(11, 7, 'L'),
(12, 7, 'M'),
(1, 7, 'M'),
(2, 7, 'M'),
(3, 7, 'M'),
(4, 7, 'M'),
(5, 7, 'M'),

-- Group 8 (current_participants: 8)
(6, 8, 'L'),
(7, 8, 'M'),
(8, 8, 'M'),
(9, 8, 'M'),
(10, 8, 'M'),
(11, 8, 'M'),
(12, 8, 'M'),
(1, 8, 'M'),

-- Group 9 (current_participants: 9)
(2, 9, 'L'),
(3, 9, 'M'),
(4, 9, 'M'),
(5, 9, 'M'),
(6, 9, 'M'),
(7, 9, 'M'),
(8, 9, 'M'),
(9, 9, 'M'),
(10, 9, 'M'),

-- Group 10 (current_participants: 10)
(11, 10, 'L'),
(12, 10, 'M'),
(1, 10, 'M'),
(2, 10, 'M'),
(3, 10, 'M'),
(4, 10, 'M'),
(5, 10, 'M'),
(6, 10, 'M'),
(7, 10, 'M'),
(8, 10, 'M'),

-- Group 11 (current_participants: 11)
(9, 11, 'L'),
(10, 11, 'M'),
(11, 11, 'M'),
(12, 11, 'M'),
(1, 11, 'M'),
(2, 11, 'M'),
(3, 11, 'M'),
(4, 11, 'M'),
(5, 11, 'M'),
(6, 11, 'M'),
(7, 11, 'M'),

-- Group 12 (current_participants: 12)
(8, 12, 'L'),
(9, 12, 'M'),
(10, 12, 'M'),
(11, 12, 'M'),
(12, 12, 'M'),
(1, 12, 'M'),
(2, 12, 'M'),
(3, 12, 'M'),
(4, 12, 'M'),
(5, 12, 'M'),
(6, 12, 'M'),
(13, 12, 'M');