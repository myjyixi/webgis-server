CREATE TABLE `users` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `user_name` varchar(255) NOT NULL COMMENT '用户名',
  `user_nick` varchar(255) DEFAULT NULL COMMENT '用户昵称',
  `password` varchar(255) NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

CREATE TABLE `measuring_event` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) DEFAULT NULL COMMENT '测量事件名',
  `update_time` varchar(20) DEFAULT NULL COMMENT '上传时间',
  `measure_time` varchar(20) DEFAULT NULL COMMENT '事件测量时间',
  `site` varchar(255) DEFAULT NULL COMMENT '地点',
  `longitude` decimal(11,7) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(11,7) DEFAULT NULL COMMENT '维度',
  `height` decimal(11,7) DEFAULT NULL COMMENT '高度',
  `g` decimal(15,1) DEFAULT NULL COMMENT '重力值',
  `uncertainty` decimal(5,1) DEFAULT NULL COMMENT '（重力值）不确定度',
  `instrument` varchar(255) DEFAULT NULL COMMENT '仪器',
  `operator` varchar(255) DEFAULT NULL COMMENT '操作员',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=425 DEFAULT CHARSET=utf8;

CREATE TABLE `measuring_point` (
  `id` bigint(255) unsigned NOT NULL AUTO_INCREMENT,
  `mjd` double(255,5) NOT NULL COMMENT '日期码',
  `g` double(255,3) NOT NULL COMMENT '原始重力值',
  `g_corr` double(255,3) DEFAULT NULL COMMENT '模型修正',
  `corr_tilt` double(255,3) DEFAULT NULL COMMENT '倾斜修正',
  `corr_tide` double(255,3) DEFAULT NULL COMMENT '潮汐修正',
  `corr_press` double(255,3) DEFAULT NULL COMMENT '气压修正',
  `corr_polar` double(255,3) DEFAULT NULL COMMENT '极地运动',
  `independ` double(255,3) DEFAULT NULL COMMENT '系统无关项',
  `event_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_key` (`event_id`),
  CONSTRAINT `event_key` FOREIGN KEY (`event_id`) REFERENCES `measuring_event` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3788 DEFAULT CHARSET=utf8;