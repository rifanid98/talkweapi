-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 03 Agu 2020 pada 19.31
-- Versi server: 10.4.11-MariaDB
-- Versi PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `talkwe`
--
CREATE DATABASE `talkwe` IF NOT EXISTS;
USE `talkwe`;
-- --------------------------------------------------------

--
-- Struktur dari tabel `attachments`
--

CREATE TABLE `attachments` (
  `id` int(11) NOT NULL,
  `file` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `attachments`
--

INSERT INTO `attachments` (`id`, `file`, `created_at`, `updated_at`) VALUES
(1, 'image.png', '2020-07-27 04:51:42', '2020-07-27 04:53:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id1` int(11) NOT NULL,
  `user_id2` int(11) NOT NULL,
  `status` int(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `friends`
--

INSERT INTO `friends` (`id`, `user_id1`, `user_id2`, `status`, `created_at`, `updated_at`) VALUES
(80, 5, 6, 1, '2020-08-03 16:42:13', '2020-08-03 16:58:36'),
(81, 4, 6, 1, '2020-08-03 16:58:08', '2020-08-03 16:58:47'),
(82, 6, 5, 1, '2020-08-03 16:58:36', '2020-08-03 16:58:36'),
(83, 6, 4, 1, '2020-08-03 16:58:47', '2020-08-03 16:58:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `message_read` int(1) NOT NULL DEFAULT 0,
  `attachment_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL,
  `online` int(1) NOT NULL DEFAULT 0,
  `location` varchar(255) DEFAULT '0|0',
  `location_share` int(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `full_name`, `email`, `password`, `image`, `online`, `location`, `location_share`, `created_at`, `updated_at`) VALUES
(4, 'admin', 'admin baik', 'admin@talkwe.com', '$2b$10$GkG9XeGne3Te9JETETsZJ.n7.W1NMM9qK9vd31S3S.YA/PrU/uNXO', 'http://192.168.42.15:3000/talkwe/images/2020-07-29T14:14:58.823ZIMG_20200729_211350.jpg', 0, '-6.5850753,106.7184448', 1, '2020-07-26 17:57:13', '2020-08-03 14:37:19'),
(5, 'staff', 'staff ganteng', 'staff@talkwe.com', '$2b$10$O09TaCKwLysdXvvvvNu/meqmFK29SfsEsf7NPxjz.iEr1UNgIh9Pu', 'http://192.168.42.15:3000/talkwe/images/2020-07-29T06:51:56.244ZIMG_20200722_161638.jpg', 0, '-6.5825761,106.720331', 1, '2020-07-26 18:56:06', '2020-08-03 16:28:20'),
(6, 'user', 'user ganteng', 'user@talkwe.com', '$2b$10$5WjQp7KdQUBJniJWvg4Wuubu/YCTQwtwH5gSvYxtmbVjhj6cFDLTG', 'http://192.168.42.15:3000/talkwe/images/2020-07-29T14:15:26.169ZIMG_20200729_211428.jpg', 0, '-6.5825761,106.720331', 1, '2020-07-26 18:56:22', '2020-08-03 17:23:38'),
(7, 'adnin', 'adnin ganteng', 'adnin@talkwe.com', '$2b$10$UHmyTImdGcd0o3vdioJb1OJenZjJVRmfvsel3EV594QjDKIssOl06', 'http://192.168.42.15:3000/talkwe/images/2020-07-29T14:15:52.505ZIMG_20200729_211449.jpg', 0, '-6.5850527,106.71858', 1, '2020-07-26 19:15:46', '2020-08-02 11:05:58'),
(8, 'rifandi', 'rifandi ganteng', 'rifandi@talkwe.com', '$2b$10$CXPUglsQBuZetDJAD/pyBeHeEMy3.b2ZHQ.wec/8Nn.HyHcizuXcK', 'http://192.168.42.15:3000/talkwe/images/default.png', 0, '0,0', 1, '2020-07-26 19:16:00', '2020-08-02 11:05:58'),
(9, 'sutanto', 'sutanto ganteng', 'sutanto@talkwe.com', '$2b$10$jXNGLPD5NIIJFA9gILs1X.3xLe4ULQKGfrCoqPX08ja8kJfNJ/djy', 'http://192.168.42.15:3000/talkwe/images/default.png', 0, '0,0', 1, '2020-07-26 19:16:19', '2020-08-02 11:05:58'),
(10, 'putra', 'putra ganteng', 'putra@talkwe.com', '$2b$10$GJQIWq14XdMlloyIMcjflOJUcUSTqqbUPUTXWDviLhLcpmujBt5y.', 'http://192.168.42.15:3000/talkwe/images/default.png', 0, '0,0', 1, '2020-07-26 19:16:28', '2020-08-02 11:05:58'),
(12, 'test', 'test test', 'test@test.com', '$2b$10$j.sGNaGbQcye8r/LvSqTDePMf/Ax5Db7lbWk7UM0Owf1j2Zk7PaPq', 'http://192.168.42.15:3000/talkwe/images/default.png', 0, '0,0', 1, '2020-07-28 06:27:06', '2020-08-02 11:05:58'),
(13, 'gamen', 'gamen gamen', 'gamen@gamen.com', '$2b$10$ENv7u7MKftKNexKMtrkbcufJ/LYBJI/93rZKE.zsS6CGk7.hEJcMG', 'http://192.168.42.15:3000/talkwe/images/2020-07-30T04:16:39.567ZIMG_20200729_211350.jpg', 0, '0,0', 1, '2020-07-30 04:13:52', '2020-08-02 11:05:58');

-- --------------------------------------------------------

--
-- Stand-in struktur untuk tampilan `v_last_message`
-- (Lihat di bawah untuk tampilan aktual)
--
CREATE TABLE `v_last_message` (
`id` int(11)
,`sender_id` int(11)
,`receiver_id` int(11)
,`message` text
,`message_read` int(1)
,`attachment_id` int(11)
,`created_at` timestamp
,`updated_at` timestamp
);

-- --------------------------------------------------------

--
-- Struktur untuk view `v_last_message`
--
DROP TABLE IF EXISTS `v_last_message`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_last_message`  AS  select `m`.`id` AS `id`,`m`.`sender_id` AS `sender_id`,`m`.`receiver_id` AS `receiver_id`,`m`.`message` AS `message`,`m`.`message_read` AS `message_read`,`m`.`attachment_id` AS `attachment_id`,`m`.`created_at` AS `created_at`,`m`.`updated_at` AS `updated_at` from (`messages` `m` left join `messages` `m1` on((`m`.`sender_id` = `m1`.`sender_id` and `m`.`receiver_id` = `m1`.`receiver_id` or `m`.`sender_id` = `m1`.`receiver_id` and `m`.`receiver_id` = `m1`.`sender_id`) and case when `m`.`created_at` = `m1`.`created_at` then `m`.`id` < `m1`.`id` else `m`.`created_at` < `m1`.`created_at` end)) where `m1`.`id` is null ;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id1` (`user_id1`),
  ADD KEY `user_id2` (`user_id2`);

--
-- Indeks untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attachment_id` (`attachment_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `attachments`
--
ALTER TABLE `attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT untuk tabel `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id1`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`user_id2`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`attachment_id`) REFERENCES `attachments` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
