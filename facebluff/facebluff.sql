-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2017 at 01:54 PM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `facebluff`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer`
--

CREATE TABLE `answer` (
  `id_answer` int(11) NOT NULL,
  `id_question` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `truth` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `have`
--

CREATE TABLE `have` (
  `id_user` int(11) NOT NULL,
  `id_friend` int(11) NOT NULL,
  `request` enum('none','accepted','rejected','waiting') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `myself`
--

CREATE TABLE `myself` (
  `id_user` int(11) NOT NULL,
  `id_question` int(11) NOT NULL,
  `id_answer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `other`
--

CREATE TABLE `other` (
  `id_user` int(11) NOT NULL,
  `id_friend` int(11) NOT NULL,
  `id_question` int(11) NOT NULL,
  `id_answer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `id_question` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `n_options` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `email` varchar(30) NOT NULL,
  `pass` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `sex` enum('M','F','O') NOT NULL,
  `birthdate` date NOT NULL,
  `photo` blob NOT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`id_answer`),
  ADD KEY `id_question` (`id_question`);

--
-- Indexes for table `have`
--
ALTER TABLE `have`
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_friend` (`id_friend`);

--
-- Indexes for table `myself`
--
ALTER TABLE `myself`
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_question` (`id_question`),
  ADD KEY `id_answer` (`id_answer`);

--
-- Indexes for table `other`
--
ALTER TABLE `other`
  ADD KEY `id_question` (`id_question`),
  ADD KEY `id_answer` (`id_answer`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_friend` (`id_friend`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id_question`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answer`
--
ALTER TABLE `answer`
  MODIFY `id_answer` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `id_question` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `question` (`id_question`);

--
-- Constraints for table `have`
--
ALTER TABLE `have`
  ADD CONSTRAINT `have_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `have_ibfk_2` FOREIGN KEY (`id_friend`) REFERENCES `user` (`id_user`);

--
-- Constraints for table `myself`
--
ALTER TABLE `myself`
  ADD CONSTRAINT `myself_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `myself_ibfk_2` FOREIGN KEY (`id_question`) REFERENCES `question` (`id_question`),
  ADD CONSTRAINT `myself_ibfk_3` FOREIGN KEY (`id_answer`) REFERENCES `answer` (`id_answer`);

--
-- Constraints for table `other`
--
ALTER TABLE `other`
  ADD CONSTRAINT `other_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `question` (`id_question`),
  ADD CONSTRAINT `other_ibfk_2` FOREIGN KEY (`id_answer`) REFERENCES `answer` (`id_answer`),
  ADD CONSTRAINT `other_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `other_ibfk_4` FOREIGN KEY (`id_friend`) REFERENCES `user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
