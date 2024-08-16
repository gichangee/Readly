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
-- Table structure for table `photocards`
--

DROP TABLE IF EXISTS `photocards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photocards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(255) DEFAULT NULL,
  `visibility` enum('A','E') DEFAULT NULL,
  `member_id` int NOT NULL,
  `book_id` int NOT NULL,
  `photocard_image` varchar(1000) DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_members_TO_photocards_1` (`member_id`),
  KEY `FK_books_TO_photocards_1` (`book_id`),
  CONSTRAINT `FK_books_TO_photocards_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `FK_members_TO_photocards_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photocards`
--

LOCK TABLES `photocards` WRITE;
/*!40000 ALTER TABLE `photocards` DISABLE KEYS */;
INSERT INTO photocards VALUES 
(1, '삶은 여행이다', 'E', 1, 1, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/201429657-%EC%83%9D%EC%84%B1ai%EB%A1%9C-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%82%B8-%EC%8B%A0%EB%B9%84%EB%A1%9C%EC%9A%B4-%EB%8F%99%ED%99%94%EA%B0%99%EC%9D%80-%EB%B6%84%EC%9C%84%EA%B8%B0%EC%9D%98-%EB%82%98%EB%AC%B4%EC%99%80-%EB%8B%AC.jpg', '2024-07-31 15:00:00'),
(2, '세상을 바꾸는 힘', 'E', 2, 2, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/201581567-%EB%8F%99%ED%99%94%EA%B0%99%EC%9D%80-%EC%9E%90%EC%97%B0-%EB%85%B9%EC%83%89-%ED%99%98%EA%B2%BD-%EB%B0%B0%EA%B2%BD-%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8-%EC%83%9D%EC%84%B1-ai.jpg', '2024-07-31 15:00:00'),
(3, '끝없는 도전', 'E', 3, 3, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/2aee4e0b-57ef-4ca7-89b3-3fe87a70bf27.png', '2024-07-31 15:00:00'),
(4, '마음을 열어라', 'E', 4, 4, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/31e8c877-bd65-4819-bfaa-b7d0f33ec5ca.png', '2024-07-31 15:00:00'),
(5, '사랑은 모든 것', 'E', 5, 5, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/5c17c676-6865-4f9b-9253-d908134fe0de.png', '2024-07-31 15:00:00'),
(6, '시간의 흐름', 'E', 6, 6, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/736a752a-9e03-412c-ad79-0fae1fe66cd2.png', '2024-07-31 15:00:00'),
(7, '진실을 찾아서', 'E', 7, 7, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/ai-generated-8650258_1280.png', '2024-07-31 15:00:00'),
(8, '희망의 빛', 'E', 8, 8, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/b5132d4d-9fc1-411f-b8b3-462ffe12d7d1.png', '2024-07-31 15:00:00'),
(9, '어둠 속의 빛', 'E', 9, 9, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/f8ec975d-6570-49ad-9d22-eba3143deeed.png', '2024-07-31 15:00:00'),
(10, '꿈꾸는 자의 길', 'E', 10, 10, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/fairytale-castle-hilltop-generative-ai_918839-2978.jpg', '2024-07-31 15:00:00'),
(11, '새로운 시작', 'E', 11, 11, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/ff3ee37b-3bf1-4695-846a-daa8bfbab9c5.png', '2024-07-31 15:00:00'),
(12, '끝이 없는 길', 'E', 12, 12, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/images+(1).jpg', '2024-07-31 15:00:00'),
(13, '변화를 꿈꾸다', 'E', 5, 13, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/images+(2).jpg', '2024-08-01 15:00:00'),
(14, '마음의 평화', 'E', 3, 14, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/images+(3).jpg', '2024-08-01 15:00:00'),
(15, '용기의 힘', 'E', 7, 15, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/images+(4).jpg', '2024-08-01 15:00:00'),
(16, '자연의 소리', 'E', 2, 16, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/images+(5).jpg', '2024-08-01 15:00:00'),
(17, '내면의 소리', 'E', 9, 17, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/images+(6).jpg', '2024-08-01 15:00:00'),
(18, '삶의 의미', 'E', 4, 18, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/images+(7).jpg', '2024-08-01 15:00:00'),
(19, '무한한 가능성', 'E', 11, 19, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/images+(8).jpg', '2024-08-01 15:00:00'),
(20, '영원의 순간', 'E', 13, 20, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/jbuJO1706360331.jpg', '2024-08-01 15:00:00'),
(21, '자유를 찾아서', 'E', 13, 21, 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/images.jpg', '2024-08-01 15:00:00'),
(22, '새는 알에서 빠져나오려고 몸부림친다. 알은 세계이다. 태어나려는 자는 누구든 세계를 부숴야 한다.', 'E', '13', '412', 'https://c207-bucket.s3.ap-southeast-2.amazonaws.com/ffb2f9e7-6616-4dbe-a4b9-6699d67707bc.png', '2024-08-14 07:47:24');


/*!40000 ALTER TABLE `photocards` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-08 15:49:48
