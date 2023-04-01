
CREATE TABLE `login` (
  `loginID` varchar(64) NOT NULL,
  `fullName` varchar(64) NOT NULL,
  `mobileNo` varchar(64) NOT NULL,
  `roleID` varchar(64) NOT NULL,
  `password` varchar(100) NOT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `status` varchar(32) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
 `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(64) NOT NULL DEFAULT 'Admin',
  `editedOn` datetime DEFAULT NULL,
  `editedBy` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`loginID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `operationlog` (
  `oid` int(64) NOT NULL AUTO_INCREMENT,
  `loginID` varchar(64) DEFAULT NULL,
  `operation` varchar(64) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`oid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `requisition` (
  `oid` int(64) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `presentAddress` varchar(100) DEFAULT NULL,
  `institute` varchar(100) DEFAULT NULL,
  `father` varchar(100) DEFAULT NULL,
  `mother` varchar(100) DEFAULT NULL,
  `contactNumber` varchar(100) DEFAULT NULL,
  `guardianContactNumber` varchar(100) DEFAULT NULL,
  `expectedUnit` varchar(100) NOT NULL,
  `branch` varchar(100) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `facebook` varchar(100) DEFAULT NULL,
  `paidAmount` varchar (100) DEFAULT NULL,
  `paymentMethod` varchar (100) DEFAULT NULL,
  `tnxId` varchar(100) DEFAULT NULL,
  `status` varchar(32) DEFAULT "Pending",
 `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(64) NOT NULL DEFAULT 'Admin',
  `editedOn` datetime DEFAULT NULL,
  `editedBy` varchar(64) DEFAULT NULL,
   PRIMARY KEY (`oid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `requisition` ADD `price` DECIMAL(32) NOT NULL AFTER `facebook`;
ALTER TABLE `requisition` CHANGE `paidAmount` `paidAmount` DECIMAL(32) NULL DEFAULT '0';

CREATE TABLE `role` (
  `roleID` varchar(64) NOT NULL,
  `roleDescription` varchar(64) NOT NULL,
  `menuJSON` longtext,
   PRIMARY KEY (`roleID`),
   KEY `fk_roleID_Login` (`roleID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `role` (`roleID`, `roleDescription`, `menuJSON`) VALUES
('developer', 'only for developer', '{"children":[{"id":"webMenu","url":"webMenu","text":"Web Menu","class":"fa fa-dashboard","enable":true,"children":[{"id":"dashboard","url":"dashboard","text":"Dashboard","class":"fa fa-dashboard","enable":true,"children":[]},{"id":"requests","url":"requests","text":"Request","class":"fa fa-ticket","enable":true,"children":[]}]}]}'),
('admin', 'only for admin', '{"children":[{"id":"webMenu","url":"webMenu","text":"Web Menu","class":"fa fa-dashboard","enable":true,"children":[{"id":"dashboard","url":"dashboard","text":"Dashboard","class":"fa fa-dashboard","enable":true,"children":[]},{"id":"requests","url":"requests","text":"Request","class":"fa fa-ticket","enable":true,"children":[]}]}]}'),


INSERT INTO `login` (`loginID`, `fullName`, `mobileNo`, `roleID`, `password`, `imagePath`, `status`, `name`, `createdOn`, `createdBy`, `editedOn`, `editedBy`) VALUES
('mahfuz', 'Mahfuz Ahmed', '', 'developer', 'mah123', 'img/photo/new-bangla-i-miss-you-sad-hd-photo-wallpaper-you-make-cry-quote-q.jpg', 'Active', 'Mahfuz Ahmed', '2017-11-04 21:15:52', 'admin', NULL, NULL);
INSERT INTO `login` (`loginID`, `fullName`, `mobileNo`, `roleID`, `password`, `imagePath`, `status`, `name`, `createdOn`, `createdBy`, `editedOn`, `editedBy`) VALUES
('ruku', 'Rokonuzzaman Ruku', '', 'admin', 'ruku123', 'img/photo/new-bangla-i-miss-you-sad-hd-photo-wallpaper-you-make-cry-quote-q.jpg', 'Active', 'Rokonuzzaman Ruku', '2019-17-03 13:15:52', 'admin', NULL, NULL);
