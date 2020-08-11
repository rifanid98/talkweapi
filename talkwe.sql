-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 07 Agu 2020 pada 14.17
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
--- CREATE DATABASE IF NOT EXISTS `talkwe`;
--- USE `talkwe`;
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
(83, 6, 4, 1, '2020-08-03 16:58:47', '2020-08-03 16:58:47'),
(84, 14, 5, 1, '2020-08-05 04:35:39', '2020-08-05 04:36:02'),
(85, 14, 4, 1, '2020-08-05 04:35:47', '2020-08-05 14:27:52'),
(86, 5, 14, 1, '2020-08-05 04:36:02', '2020-08-05 04:36:02'),
(87, 4, 14, 1, '2020-08-05 14:27:52', '2020-08-05 14:27:52'),
(88, 4, 5, 1, '2020-08-05 14:36:31', '2020-08-06 08:14:09'),
(89, 4, 7, 1, '2020-08-05 14:36:35', '2020-08-05 14:37:04'),
(90, 4, 8, 1, '2020-08-05 14:36:40', '2020-08-05 14:37:17'),
(91, 4, 9, 1, '2020-08-05 14:36:44', '2020-08-05 14:37:50'),
(92, 7, 4, 1, '2020-08-05 14:37:04', '2020-08-05 14:37:04'),
(93, 8, 4, 1, '2020-08-05 14:37:17', '2020-08-05 14:37:17'),
(94, 9, 4, 1, '2020-08-05 14:37:50', '2020-08-05 14:37:50'),
(96, 13, 4, 1, '2020-08-05 15:02:04', '2020-08-06 07:11:02'),
(97, 17, 6, 1, '2020-08-06 03:39:54', '2020-08-06 03:40:28'),
(98, 6, 17, 1, '2020-08-06 03:40:28', '2020-08-06 03:40:28'),
(99, 4, 13, 1, '2020-08-06 07:11:02', '2020-08-06 07:11:02'),
(100, 5, 4, 1, '2020-08-06 08:14:09', '2020-08-06 08:14:09');

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

--
-- Dumping data untuk tabel `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `message_read`, `attachment_id`, `created_at`, `updated_at`) VALUES
(226, 14, 5, 'T', 1, NULL, '2020-08-05 07:12:08', '2020-08-05 07:12:13'),
(227, 14, 5, 'T', 1, NULL, '2020-08-05 07:13:04', '2020-08-05 07:13:05'),
(228, 14, 5, 'T', 1, NULL, '2020-08-05 07:13:39', '2020-08-05 07:13:39'),
(229, 14, 5, 'Me', 1, NULL, '2020-08-05 07:14:17', '2020-08-05 07:14:18'),
(230, 14, 5, 'Tt', 1, NULL, '2020-08-05 07:14:50', '2020-08-05 07:14:50'),
(231, 14, 5, 'Tt', 1, NULL, '2020-08-05 07:15:10', '2020-08-05 07:15:10'),
(232, 14, 5, 'Tt', 1, NULL, '2020-08-05 07:15:47', '2020-08-05 07:15:48'),
(233, 14, 5, 'Saya', 1, NULL, '2020-08-05 07:16:07', '2020-08-05 07:16:08'),
(234, 14, 5, 'Hai', 1, NULL, '2020-08-05 07:16:29', '2020-08-05 07:16:29'),
(235, 14, 5, 'Hai', 1, NULL, '2020-08-05 07:16:36', '2020-08-05 07:16:40'),
(236, 8, 4, 'Good evening', 1, NULL, '2020-08-05 14:37:31', '2020-08-06 16:52:49'),
(237, 9, 4, 'Are you okay sir? ', 1, NULL, '2020-08-05 14:38:19', '2020-08-05 14:39:22'),
(238, 4, 6, 'Hei :D', 1, NULL, '2020-08-05 14:39:00', '2020-08-06 02:17:24'),
(239, 4, 7, 'We have some awesome projects last week...', 1, NULL, '2020-08-05 14:40:08', '2020-08-05 14:42:10'),
(240, 7, 4, 'Yeah, of course', 1, NULL, '2020-08-05 14:42:34', '2020-08-05 14:43:48'),
(241, 7, 4, 'Will there be more projects next week?', 1, NULL, '2020-08-05 14:43:39', '2020-08-05 14:43:48'),
(242, 4, 7, 'Maybe yes', 1, NULL, '2020-08-05 14:44:23', '2020-08-05 14:44:24'),
(243, 7, 4, 'What is the project about next week?', 1, NULL, '2020-08-05 14:45:25', '2020-08-05 14:45:26'),
(244, 4, 7, 'Seems to be about a chat application', 1, NULL, '2020-08-05 14:46:16', '2020-08-05 14:46:17'),
(245, 4, 6, 'hai juga', 1, NULL, '2020-08-06 02:20:04', '2020-08-06 02:20:04'),
(246, 6, 4, 'apa kabar', 1, NULL, '2020-08-06 02:20:12', '2020-08-06 02:20:12'),
(247, 4, 6, 'baik, kamu?', 1, NULL, '2020-08-06 02:20:20', '2020-08-06 02:20:20'),
(248, 17, 6, 'Hai', 1, NULL, '2020-08-06 03:41:11', '2020-08-06 03:41:24'),
(249, 6, 17, 'Hai juga', 1, NULL, '2020-08-06 03:41:33', '2020-08-06 03:41:33'),
(250, 17, 6, 'Apa kabar', 1, NULL, '2020-08-06 03:41:47', '2020-08-06 03:41:51');

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
  `status` varchar(150) NOT NULL DEFAULT 'Hi there! I''m using TalkWe',
  `location` varchar(255) DEFAULT '0,0',
  `location_share` int(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `full_name`, `email`, `password`, `image`, `online`, `status`, `location`, `location_share`, `created_at`, `updated_at`) VALUES
(4, 'admin', 'admin manager', 'admin@talkwe.com', '$2b$10$GkG9XeGne3Te9JETETsZJ.n7.W1NMM9qK9vd31S3S.YA/PrU/uNXO', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T16:11:14.110ZIMG-20200806-WA0002.jpg', 1, 'Hi there! I\'m using TalkWeeee', '-6.5825761,106.720331', 0, '2020-07-26 17:57:13', '2020-08-06 19:13:12'),
(5, 'staff', 'staff assistant', 'staff@talkwe.com', '$2b$10$O09TaCKwLysdXvvvvNu/meqmFK29SfsEsf7NPxjz.iEr1UNgIh9Pu', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T12:17:54.819Z235544.jpg', 0, 'Hi there! I\'m using TalkWe', '-6.5825761,106.720331', 0, '2020-07-26 18:56:06', '2020-08-06 13:45:40'),
(6, 'user', 'user creative banget', 'user@talkwe.com', '$2b$10$5WjQp7KdQUBJniJWvg4Wuubu/YCTQwtwH5gSvYxtmbVjhj6cFDLTG', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T12:18:19.018Z2422614.jpg', 0, 'Hi there! I\'m using TalkWe', '-6.5825761,106.720331', 1, '2020-07-26 18:56:22', '2020-08-06 13:45:40'),
(7, 'adnin', 'adnin rifandi', 'adnin@talkwe.com', '$2b$10$UHmyTImdGcd0o3vdioJb1OJenZjJVRmfvsel3EV594QjDKIssOl06', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T12:18:43.400Z2422609.jpg', 0, 'Hi there! I\'m using TalkWe', '-6.5825761,106.720331', 1, '2020-07-26 19:15:46', '2020-08-06 13:45:40'),
(8, 'rifandi', 'rifandi sutanto', 'rifandi@talkwe.com', '$2b$10$CXPUglsQBuZetDJAD/pyBeHeEMy3.b2ZHQ.wec/8Nn.HyHcizuXcK', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T12:19:25.669Z2422608.jpg', 0, 'Hi there! I\'m using TalkWe', '-6.5825761,106.720331', 1, '2020-07-26 19:16:00', '2020-08-06 13:45:40'),
(9, 'sutanto', 'sutanto putra', 'sutanto@talkwe.com', '$2b$10$jXNGLPD5NIIJFA9gILs1X.3xLe4ULQKGfrCoqPX08ja8kJfNJ/djy', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T12:19:51.539Z157244.jpg', 0, 'Hi there! I\'m using TalkWe', '-6.5825761,106.720331', 1, '2020-07-26 19:16:19', '2020-08-06 13:45:40'),
(10, 'putra', 'putra sanjaya', 'putra@talkwe.com', '$2b$10$GJQIWq14XdMlloyIMcjflOJUcUSTqqbUPUTXWDviLhLcpmujBt5y.', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T12:13:24.303Z2422630.jpg', 0, 'Hi there! I\'m using TalkWe', '-6.5825761,106.720331', 1, '2020-07-26 19:16:28', '2020-08-06 13:45:40'),
(13, 'gamen', 'gamen gamen', 'gamen@gamen.com', '$2b$10$ENv7u7MKftKNexKMtrkbcufJ/LYBJI/93rZKE.zsS6CGk7.hEJcMG', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T12:21:11.995ZFB_IMG_15927595979202839.jpg', 0, 'Hi there! I\'m using TalkWe', '-6.5825761,106.720331', 1, '2020-07-30 04:13:52', '2020-08-06 13:52:20'),
(14, 'talkwe', 'Talkwe Talkwe', 'talkwe@talkwe.com', '$2b$10$5rNbLyOuJ3Stqm3FGa8Xcua4ZxVPmbP/dlJaha8fNd.5VpG8RZ7Wy', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T12:20:13.820Z235539.jpg', 0, 'Hi there! I\'m using TalkWe', '-6.5825761,106.720331', 0, '2020-08-05 04:05:59', '2020-08-06 13:45:40'),
(17, 'mark', 'mark Zuckerberg', 'mark@facebook.com', '$2b$10$OI60FdX6XYaOW9DxK1JUgOuiWONRmofUzQ2bMR6g/hX9shrGUzXZ.', 'http://192.168.43.81:3000/talkwe/images/2020-08-06T12:20:35.091Zdownload.jpeg', 0, 'Hi there! I\'m using TalkWe', '-6.5825761,106.720331', 0, '2020-08-06 03:33:38', '2020-08-06 13:45:40');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT untuk tabel `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=251;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
