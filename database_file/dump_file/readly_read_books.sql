-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: readly
-- ------------------------------------------------------
-- Server version  8.0.38

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
-- Dumping data for table `read_books`
--

LOCK TABLES `read_books` WRITE;
/*!40000 ALTER TABLE `read_books` DISABLE KEYS */;
INSERT INTO `read_books` (`id`, `member_id`, `book_id`, `current_page`, `group_id`)
VALUES
(1, 1, 1, 0, 1),
(2, 2, 1, 0, 1),
(3, 3, 2, 0, 2),
(4, 4, 2, 0, 2),
(5, 5, 3, 0, 3),
(6, 6, 3, 0, 3),
(7, 7, 3, 0, 3),
(8, 8, 4, 0, 4),
(9, 9, 4, 0, 4),
(10, 10, 4, 0, 4),
(11, 11, 4, 0, 4),
(12, 12, 5, 0, 5),
(13, 1, 5, 0, 5),
(14, 2, 5, 0, 5),
(15, 3, 5, 0, 5),
(16, 4, 5, 0, 5),
(17, 5, 6, 0, 6),
(18, 6, 6, 0, 6),
(19, 7, 6, 0, 6),
(20, 8, 6, 0, 6),
(21, 9, 6, 0, 6),
(22, 10, 6, 0, 6),
(23, 11, 7, 0, 7),
(24, 12, 7, 0, 7),
(25, 1, 7, 0, 7),
(26, 2, 7, 0, 7),
(27, 3, 7, 0, 7),
(28, 4, 7, 0, 7),
(29, 5, 7, 0, 7),
(30, 6, 8, 0, 8),
(31, 7, 8, 0, 8),
(32, 8, 8, 0, 8),
(33, 9, 8, 0, 8),
(34, 10, 8, 0, 8),
(35, 11, 8, 0, 8),
(36, 12, 8, 0, 8),
(37, 1, 8, 0, 8),
(38, 2, 9, 0, 9),
(39, 3, 9, 0, 9),
(40, 4, 9, 0, 9),
(41, 5, 9, 0, 9),
(42, 6, 9, 0, 9),
(43, 7, 9, 0, 9),
(44, 8, 9, 0, 9),
(45, 9, 9, 0, 9),
(46, 10, 9, 0, 9),
(47, 11, 10, 0, 10),
(48, 12, 10, 0, 10),
(49, 1, 10, 0, 10),
(50, 2, 10, 0, 10),
(51, 3, 10, 0, 10),
(52, 4, 10, 0, 10),
(53, 5, 10, 0, 10),
(54, 6, 10, 0, 10),
(55, 7, 10, 0, 10),
(56, 8, 10, 0, 10),
(57, 9, 11, 0, 11),
(58, 10, 11, 0, 11),
(59, 11, 11, 0, 11),
(60, 12, 11, 0, 11),
(61, 1, 11, 0, 11),
(62, 2, 11, 0, 11),
(63, 3, 11, 0, 11),
(64, 4, 11, 0, 11),
(65, 5, 11, 0, 11),
(66, 6, 11, 0, 11),
(67, 7, 11, 0, 11),
(68, 8, 12, 0, 12),
(69, 9, 12, 0, 12),
(70, 10, 12, 0, 12),
(71, 11, 12, 0, 12),
(72, 12, 12, 0, 12),
(73, 1, 12, 0, 12),
(74, 2, 12, 0, 12),
(75, 3, 12, 0, 12),
(76, 4, 12, 0, 12),
(77, 5, 12, 0, 12),
(78, 6, 12, 0, 12),
(79, 13, 12, 0, 12),
(80, 1, 13, 0, NULL),
(81, 2, 13, 0, NULL),
(82, 3, 14, 0, NULL),
(83, 4, 14, 0, NULL),
(84, 5, 15, 0, NULL),
(85, 6, 15, 0, NULL),
(86, 7, 16, 0, NULL),
(87, 8, 16, 0, NULL),
(88, 9, 17, 0, NULL),
(89, 10, 17, 0, NULL),
(90, 11, 18, 0, NULL),
(91, 12, 18, 0, NULL),
(92, 1, 19, 0, NULL),
(93, 2, 19, 0, NULL),
(94, 3, 20, 0, NULL),
(95, 4, 20, 0, NULL),
(96, 5, 21, 0, NULL),
(97, 6, 21, 0, NULL),
(98, 7, 22, 0, NULL),
(99, 8, 22, 0, NULL),
(100, 9, 23, 0, NULL),
(101, 10, 23, 0, NULL),
(102, 11, 24, 0, NULL),
(103, 12, 24, 0, NULL),
(104, 13, 24, 0, NULL);
/*!40000 ALTER TABLE `read_books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


INSERT INTO `read_books` (`id`, `member_id`, `book_id`, `current_page`, `read_type`,`group_id`)
VALUES
(105, 9, 24, 240, 'D' ,NULL),
(106,9,37,64,'D',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
