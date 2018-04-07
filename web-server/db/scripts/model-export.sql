-- MySQL Script generated by MySQL Workbench
-- Sat Apr  7 10:24:23 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema schema
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema schema
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `schema` DEFAULT CHARACTER SET utf8 ;
USE `schema` ;

-- -----------------------------------------------------
-- Table `schema`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schema`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schema`.`session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schema`.`session` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sessionscol` VARCHAR(45) NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_session_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_session_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `schema`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schema`.`meta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schema`.`meta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `session_id` INT NOT NULL,
  `session_user_id` INT NOT NULL,
  `start_date` DATETIME NULL,
  `end_date` DATETIME NULL,
  PRIMARY KEY (`id`, `session_id`, `session_user_id`),
  INDEX `fk_meta_session1_idx` (`session_id` ASC, `session_user_id` ASC),
  CONSTRAINT `fk_meta_session1`
    FOREIGN KEY (`session_id` , `session_user_id`)
    REFERENCES `schema`.`session` (`id` , `user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schema`.`data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schema`.`data` (
  `id` INT NOT NULL,
  `session_id` INT NOT NULL,
  `session_user_id` INT NOT NULL,
  `time_stamp` DATETIME NULL,
  `roll` DECIMAL(2) NULL,
  `pitch` DECIMAL(2) NULL,
  `yaw` DECIMAL(2) NULL,
  `longitude` DECIMAL(6) NULL,
  `latitude` DECIMAL(6) NULL,
  `x` DECIMAL(4) NULL,
  `y` DECIMAL(4) NULL,
  `z` DECIMAL(4) NULL,
  PRIMARY KEY (`id`, `session_id`, `session_user_id`),
  INDEX `fk_data_session1_idx` (`session_id` ASC, `session_user_id` ASC),
  CONSTRAINT `fk_data_session1`
    FOREIGN KEY (`session_id` , `session_user_id`)
    REFERENCES `schema`.`session` (`id` , `user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
