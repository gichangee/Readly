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
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`title`, `description`, `is_inviting`, `created_date`, `max_participants`, `current_participants`, `room_id`)
VALUES 
('행복한 모임', '행복을 추구하는 모임입니다..', 'a', '2024-08-01 10:00:00', 10, 2, 'room1'),
('함께하는 모임', '함께 성장하는 모임입니다.', 'a', '2024-08-01 11:00:00', 15, 2, 'room2'),
('즐거운 모임', '모두가 즐길 수 있는 모임입니다.', 'a', '2024-08-01 12:00:00', 20, 3, 'room3'),
('배움의 시간', '새로운 것을 배우는 모임입니다.', 'a', '2024-08-01 13:00:00', 12, 4, 'room4'),
('여행 모임', '여행을 사랑하는 사람들이 모이는 곳입니다.', 'a', '2024-08-01 14:00:00', 25, 5, 'room5'),
('독서 모임', '책을 함께 읽고 토론하는 모임입니다.', 'a', '2024-08-01 15:00:00', 30, 6, 'room6'),
('음악 모임', '음악을 함께 즐기는 모임입니다.', 'a', '2024-08-01 16:00:00', 8, 7, 'room7'),
('요리 모임', '요리를 함께 배우고 나누는 모임입니다.', 'a', '2024-08-01 17:00:00', 22, 8, 'room8'),
('운동 모임', '건강을 위해 함께 운동하는 모임입니다.', 'a', '2024-08-01 18:00:00', 18, 9, 'room9'),
('취미 모임', '다양한 취미를 함께 즐기는 모임입니다.', 'a', '2024-08-01 19:00:00', 16, 10, 'room10'),
('사진 모임', '사진을 사랑하는 사람들이 모이는 곳입니다.', 'a', '2024-08-01 20:00:00', 14, 11, 'room11'),
('영화 모임', '영화를 함께 보고 이야기하는 모임입니다.', 'r', '2024-08-01 21:00:00', 12, 12, 'room12');
