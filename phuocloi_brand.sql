/*
 Navicat Premium Data Transfer

 Source Server         : Phuoc Loi
 Source Server Type    : MySQL
 Source Server Version : 100130
 Source Host           : localhost:3306
 Source Schema         : phuocloi_brand

 Target Server Type    : MySQL
 Target Server Version : 100130
 File Encoding         : 65001

 Date: 14/07/2023 16:36:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for pl_user
-- ----------------------------
DROP TABLE IF EXISTS `pl_user`;
CREATE TABLE `pl_user`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `pass_word` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `full_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL COMMENT '1:True 2 : False',
  `create_date` datetime NULL DEFAULT NULL,
  `update_date` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pl_user
-- ----------------------------
INSERT INTO `pl_user` VALUES (1, 'phuocloiphuocloi', 'pyvina2086', 'Nguyen Phuoc Loi', 'phuocloiphuocloi24@gmail.com', '0786525788', 2, '2023-07-14 13:59:29', '2023-07-14 13:59:29');
INSERT INTO `pl_user` VALUES (2, 'phuocloi', 'a1dfcf81599c0da6e4fab688c17d50526779c336c00de28e253433b74da1c3966f88b1d15c7c43818771848a31688cb1fce4ca8262c0ce5ce7d413633216c67f', 'Nguyen Phuoc Loi', 'phuocloiphuocloi24@gmail.com', '0786525788', 2, '2023-07-14 14:54:37', '2023-07-14 14:54:37');

SET FOREIGN_KEY_CHECKS = 1;
