-- ============================================================================
-- Hamid Afandi — full database (schema + seed data)
-- Generated 2026-07-18T22:41:13.155Z by packages/db/src/generate-sql-dump.ts
-- Source of truth: packages/db/src/schema/*.ts (Drizzle) + packages/db/src/seed.ts
-- Regenerate with: pnpm db:dump
--
-- Import with MySQL Workbench (Server > Data Import > Import from Self-Contained File)
-- or phpMyAdmin (Import tab), or from a terminal:
--   mysql -u root -p < hamid_afandi.sql
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `hamid` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hamid`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- SCHEMA (40 tables)
-- ============================================================================
CREATE TABLE `branches` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`code` varchar(32) NOT NULL,
	`name` varchar(191) NOT NULL,
	`address` varchar(255),
	`phone` varchar(32),
	`timezone` varchar(64) NOT NULL DEFAULT 'Africa/Cairo',
	`currency` char(3) NOT NULL DEFAULT 'EGP',
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `branches_id` PRIMARY KEY(`id`),
	CONSTRAINT `branches_code_unique` UNIQUE(`code`)
);
CREATE TABLE `activity_logs` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`actor_user_id` bigint unsigned,
	`action` varchar(100) NOT NULL,
	`entity_type` varchar(100) NOT NULL,
	`entity_id` bigint unsigned,
	`changes` json,
	`ip` varchar(64),
	`user_agent` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
CREATE TABLE `password_resets` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`used_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_resets_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_resets_token_unique` UNIQUE(`token`)
);
CREATE TABLE `permissions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`group` varchar(100) NOT NULL,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_slug_unique` UNIQUE(`slug`)
);
CREATE TABLE `role_permissions` (
	`role_id` bigint unsigned NOT NULL,
	`permission_id` bigint unsigned NOT NULL,
	CONSTRAINT `role_permissions_role_id_permission_id_pk` PRIMARY KEY(`role_id`,`permission_id`)
);
CREATE TABLE `roles` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`is_system` boolean NOT NULL DEFAULT false,
	`description` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_slug_unique` UNIQUE(`slug`)
);
CREATE TABLE `sessions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`session_token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_session_token_unique` UNIQUE(`session_token`)
);
CREATE TABLE `user_roles` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`role_id` bigint unsigned NOT NULL,
	`branch_id` bigint unsigned,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_roles_unique` UNIQUE(`user_id`,`role_id`,`branch_id`)
);
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`email` varchar(191) NOT NULL,
	`phone` varchar(32),
	`password_hash` varchar(255),
	`full_name` varchar(191) NOT NULL,
	`avatar_media_id` bigint unsigned,
	`status` varchar(32) NOT NULL DEFAULT 'active',
	`email_verified_at` timestamp,
	`phone_verified_at` timestamp,
	`last_login_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
CREATE TABLE `verification_tokens` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`identifier` varchar(191) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `verification_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `verification_tokens_token_unique` UNIQUE(`token`)
);
CREATE TABLE `addresses` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`customer_id` bigint unsigned,
	`guest_token` varchar(64),
	`label` varchar(100),
	`recipient_name` varchar(191) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`governorate` varchar(100) NOT NULL,
	`city` varchar(100),
	`area` varchar(100),
	`street` varchar(255) NOT NULL,
	`building` varchar(50),
	`floor` varchar(20),
	`apartment` varchar(20),
	`landmark` varchar(255),
	`lat` decimal(10,7),
	`lng` decimal(10,7),
	`is_default` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
CREATE TABLE `customers` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`user_id` bigint unsigned NOT NULL,
	`loyalty_points` int NOT NULL DEFAULT 0,
	`notes` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_user_id_unique` UNIQUE(`user_id`)
);
CREATE TABLE `media` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`disk` varchar(32) NOT NULL DEFAULT 'minio',
	`bucket` varchar(100) NOT NULL,
	`object_key` varchar(512) NOT NULL,
	`url` varchar(1024) NOT NULL,
	`mime` varchar(100) NOT NULL,
	`width` int,
	`height` int,
	`size_bytes` bigint unsigned,
	`alt` varchar(255),
	`title` varchar(255),
	`folder` varchar(100),
	`uploaded_by` bigint unsigned,
	`is_private` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
CREATE TABLE `menu_categories` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`slug` varchar(150) NOT NULL,
	`icon` varchar(100),
	`image_media_id` bigint unsigned,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `menu_categories_slug_unique` UNIQUE(`slug`)
);
CREATE TABLE `menu_category_translations` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`category_id` bigint unsigned NOT NULL,
	`locale` char(5) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(500),
	CONSTRAINT `menu_category_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `menu_category_translations_unique` UNIQUE(`category_id`,`locale`)
);
CREATE TABLE `menu_hero_images` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`media_id` bigint unsigned NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_hero_images_id` PRIMARY KEY(`id`)
);
CREATE TABLE `menu_item_translations` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`item_id` bigint unsigned NOT NULL,
	`locale` char(5) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(500),
	`notes` varchar(255),
	CONSTRAINT `menu_item_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `menu_item_translations_unique` UNIQUE(`item_id`,`locale`)
);
CREATE TABLE `menu_items` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`category_id` bigint unsigned NOT NULL,
	`slug` varchar(150) NOT NULL,
	`price` decimal(12,2) NOT NULL,
	`currency` char(3) NOT NULL DEFAULT 'EGP',
	`image_media_id` bigint unsigned,
	`badge` varchar(50),
	`is_featured` boolean NOT NULL DEFAULT false,
	`is_new` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `menu_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `menu_items_slug_unique` UNIQUE(`slug`)
);
CREATE TABLE `store_categories` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`slug` varchar(150) NOT NULL,
	`image_media_id` bigint unsigned,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `store_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `store_categories_slug_unique` UNIQUE(`slug`)
);
CREATE TABLE `store_category_translations` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`category_id` bigint unsigned NOT NULL,
	`locale` char(5) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(500),
	CONSTRAINT `store_category_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `store_category_translations_unique` UNIQUE(`category_id`,`locale`)
);
CREATE TABLE `store_product_media` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`product_id` bigint unsigned NOT NULL,
	`media_id` bigint unsigned NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_primary` boolean NOT NULL DEFAULT false,
	CONSTRAINT `store_product_media_id` PRIMARY KEY(`id`)
);
CREATE TABLE `store_product_translations` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`product_id` bigint unsigned NOT NULL,
	`locale` char(5) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(1000),
	`notes` varchar(255),
	CONSTRAINT `store_product_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `store_product_translations_unique` UNIQUE(`product_id`,`locale`)
);
CREATE TABLE `store_products` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`category_id` bigint unsigned NOT NULL,
	`slug` varchar(150) NOT NULL,
	`sku` varchar(64),
	`price` decimal(12,2) NOT NULL,
	`currency` char(3) NOT NULL DEFAULT 'EGP',
	`compare_at_price` decimal(12,2),
	`is_best_seller` boolean NOT NULL DEFAULT false,
	`is_featured_home` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`stock_qty` int NOT NULL DEFAULT 0,
	`rating` decimal(2,1),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `store_products_id` PRIMARY KEY(`id`),
	CONSTRAINT `store_products_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `store_products_sku_unique` UNIQUE(`sku`)
);
CREATE TABLE `banner_translations` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`banner_id` bigint unsigned NOT NULL,
	`locale` char(5) NOT NULL,
	`title` varchar(191),
	`subtitle` varchar(255),
	`cta_text` varchar(100),
	CONSTRAINT `banner_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `banner_translations_unique` UNIQUE(`banner_id`,`locale`)
);
CREATE TABLE `banners` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`media_id` bigint unsigned NOT NULL,
	`link_url` varchar(512),
	`placement` varchar(50) NOT NULL,
	`starts_at` timestamp,
	`ends_at` timestamp,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `banners_id` PRIMARY KEY(`id`)
);
CREATE TABLE `content_blocks` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`page` varchar(50) NOT NULL,
	`block_key` varchar(100) NOT NULL,
	`type` varchar(50) NOT NULL,
	`payload` json NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_blocks_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_blocks_page_key_unique` UNIQUE(`page`,`block_key`)
);
CREATE TABLE `settings` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`group` varchar(50) NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_group_key_unique` UNIQUE(`group`,`key`)
);
CREATE TABLE `discount_categories` (
	`discount_id` bigint unsigned NOT NULL,
	`store_category_id` bigint unsigned NOT NULL,
	CONSTRAINT `discount_categories_discount_id_store_category_id_pk` PRIMARY KEY(`discount_id`,`store_category_id`)
);
CREATE TABLE `discount_products` (
	`discount_id` bigint unsigned NOT NULL,
	`store_product_id` bigint unsigned NOT NULL,
	CONSTRAINT `discount_products_discount_id_store_product_id_pk` PRIMARY KEY(`discount_id`,`store_product_id`)
);
CREATE TABLE `discounts` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`name` varchar(191) NOT NULL,
	`type` varchar(20) NOT NULL,
	`value` decimal(12,2) NOT NULL,
	`scope` varchar(20) NOT NULL,
	`code` varchar(50),
	`min_order_total` decimal(12,2),
	`max_uses` int,
	`per_user_limit` int,
	`used_count` int NOT NULL DEFAULT 0,
	`starts_at` timestamp NOT NULL,
	`ends_at` timestamp NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`branch_id` bigint unsigned,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `discounts_code_unique` UNIQUE(`code`)
);
CREATE TABLE `cart_items` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`cart_id` bigint unsigned NOT NULL,
	`store_product_id` bigint unsigned NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`unit_price_snapshot` decimal(12,2) NOT NULL,
	`notes` varchar(255),
	`options` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
CREATE TABLE `carts` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`user_id` bigint unsigned,
	`guest_token` varchar(64),
	`branch_id` bigint unsigned,
	`currency` char(3) NOT NULL DEFAULT 'EGP',
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carts_id` PRIMARY KEY(`id`)
);
CREATE TABLE `discount_redemptions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`discount_id` bigint unsigned NOT NULL,
	`order_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned,
	`amount` decimal(12,2) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `discount_redemptions_id` PRIMARY KEY(`id`)
);
CREATE TABLE `order_discounts` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`order_id` bigint unsigned NOT NULL,
	`discount_id` bigint unsigned,
	`code` varchar(50),
	`amount` decimal(12,2) NOT NULL,
	CONSTRAINT `order_discounts_id` PRIMARY KEY(`id`)
);
CREATE TABLE `order_items` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`order_id` bigint unsigned NOT NULL,
	`store_product_id` bigint unsigned,
	`name_snapshot` varchar(191) NOT NULL,
	`sku_snapshot` varchar(64),
	`unit_price` decimal(12,2) NOT NULL,
	`quantity` int NOT NULL,
	`line_total` decimal(12,2) NOT NULL,
	`options` json,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
CREATE TABLE `order_status_history` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`order_id` bigint unsigned NOT NULL,
	`status` varchar(30) NOT NULL,
	`note` varchar(255),
	`changed_by` bigint unsigned,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_status_history_id` PRIMARY KEY(`id`)
);
CREATE TABLE `orders` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`order_number` varchar(32) NOT NULL,
	`customer_id` bigint unsigned,
	`guest_contact` json,
	`branch_id` bigint unsigned,
	`channel` varchar(20) NOT NULL DEFAULT 'web',
	`status` varchar(30) NOT NULL DEFAULT 'pending',
	`fulfillment_type` varchar(20) NOT NULL,
	`address_id` bigint unsigned,
	`subtotal` decimal(12,2) NOT NULL,
	`discount_total` decimal(12,2) NOT NULL DEFAULT '0.00',
	`tax_total` decimal(12,2) NOT NULL DEFAULT '0.00',
	`delivery_fee` decimal(12,2) NOT NULL DEFAULT '0.00',
	`grand_total` decimal(12,2) NOT NULL,
	`currency` char(3) NOT NULL DEFAULT 'EGP',
	`placed_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_order_number_unique` UNIQUE(`order_number`)
);
CREATE TABLE `payment_methods` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`config` json,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_methods_code_unique` UNIQUE(`code`)
);
CREATE TABLE `payments` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`order_id` bigint unsigned NOT NULL,
	`method_id` bigint unsigned NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`currency` char(3) NOT NULL DEFAULT 'EGP',
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`provider_ref` varchar(191),
	`proof_media_id` bigint unsigned,
	`reviewed_by` bigint unsigned,
	`reviewed_at` timestamp,
	`notes` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_actor_user_id_users_id_fk` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `password_resets` ADD CONSTRAINT `password_resets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `customers` ADD CONSTRAINT `customers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `media` ADD CONSTRAINT `media_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `menu_categories` ADD CONSTRAINT `menu_categories_image_media_id_media_id_fk` FOREIGN KEY (`image_media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `menu_category_translations` ADD CONSTRAINT `menu_category_translations_category_id_menu_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `menu_categories`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `menu_hero_images` ADD CONSTRAINT `menu_hero_images_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `menu_item_translations` ADD CONSTRAINT `menu_item_translations_item_id_menu_items_id_fk` FOREIGN KEY (`item_id`) REFERENCES `menu_items`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_category_id_menu_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `menu_categories`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_image_media_id_media_id_fk` FOREIGN KEY (`image_media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `store_categories` ADD CONSTRAINT `store_categories_image_media_id_media_id_fk` FOREIGN KEY (`image_media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `store_category_translations` ADD CONSTRAINT `store_category_translations_category_id_store_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `store_categories`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `store_product_media` ADD CONSTRAINT `store_product_media_product_id_store_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `store_products`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `store_product_media` ADD CONSTRAINT `store_product_media_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `store_product_translations` ADD CONSTRAINT `store_product_translations_product_id_store_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `store_products`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `store_products` ADD CONSTRAINT `store_products_category_id_store_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `store_categories`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `banner_translations` ADD CONSTRAINT `banner_translations_banner_id_banners_id_fk` FOREIGN KEY (`banner_id`) REFERENCES `banners`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `banners` ADD CONSTRAINT `banners_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `discount_categories` ADD CONSTRAINT `discount_categories_discount_id_discounts_id_fk` FOREIGN KEY (`discount_id`) REFERENCES `discounts`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `discount_categories` ADD CONSTRAINT `discount_categories_store_category_id_store_categories_id_fk` FOREIGN KEY (`store_category_id`) REFERENCES `store_categories`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `discount_products` ADD CONSTRAINT `discount_products_discount_id_discounts_id_fk` FOREIGN KEY (`discount_id`) REFERENCES `discounts`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `discount_products` ADD CONSTRAINT `discount_products_store_product_id_store_products_id_fk` FOREIGN KEY (`store_product_id`) REFERENCES `store_products`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `discounts` ADD CONSTRAINT `discounts_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cart_id_carts_id_fk` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_store_product_id_store_products_id_fk` FOREIGN KEY (`store_product_id`) REFERENCES `store_products`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `carts` ADD CONSTRAINT `carts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `carts` ADD CONSTRAINT `carts_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `discount_redemptions` ADD CONSTRAINT `discount_redemptions_discount_id_discounts_id_fk` FOREIGN KEY (`discount_id`) REFERENCES `discounts`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `discount_redemptions` ADD CONSTRAINT `discount_redemptions_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `discount_redemptions` ADD CONSTRAINT `discount_redemptions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `order_discounts` ADD CONSTRAINT `order_discounts_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `order_discounts` ADD CONSTRAINT `order_discounts_discount_id_discounts_id_fk` FOREIGN KEY (`discount_id`) REFERENCES `discounts`(`id`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_store_product_id_store_products_id_fk` FOREIGN KEY (`store_product_id`) REFERENCES `store_products`(`id`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `order_status_history` ADD CONSTRAINT `order_status_history_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `order_status_history` ADD CONSTRAINT `order_status_history_changed_by_users_id_fk` FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `orders` ADD CONSTRAINT `orders_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `orders` ADD CONSTRAINT `orders_address_id_addresses_id_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `payments` ADD CONSTRAINT `payments_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `payments` ADD CONSTRAINT `payments_method_id_payment_methods_id_fk` FOREIGN KEY (`method_id`) REFERENCES `payment_methods`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `payments` ADD CONSTRAINT `payments_proof_media_id_media_id_fk` FOREIGN KEY (`proof_media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `payments` ADD CONSTRAINT `payments_reviewed_by_users_id_fk` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;
CREATE INDEX `activity_logs_entity_idx` ON `activity_logs` (`entity_type`,`entity_id`);
CREATE INDEX `activity_logs_actor_idx` ON `activity_logs` (`actor_user_id`);
CREATE INDEX `user_roles_user_idx` ON `user_roles` (`user_id`);
CREATE INDEX `verification_tokens_identifier_idx` ON `verification_tokens` (`identifier`);
CREATE INDEX `addresses_customer_idx` ON `addresses` (`customer_id`);
CREATE INDEX `addresses_guest_idx` ON `addresses` (`guest_token`);
CREATE INDEX `menu_items_category_idx` ON `menu_items` (`category_id`);
CREATE INDEX `store_product_media_product_idx` ON `store_product_media` (`product_id`);
CREATE INDEX `store_products_category_idx` ON `store_products` (`category_id`);
CREATE INDEX `content_blocks_page_idx` ON `content_blocks` (`page`);
CREATE INDEX `cart_items_cart_idx` ON `cart_items` (`cart_id`);
CREATE INDEX `carts_user_idx` ON `carts` (`user_id`);
CREATE INDEX `carts_guest_idx` ON `carts` (`guest_token`);
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);
CREATE INDEX `order_status_history_order_idx` ON `order_status_history` (`order_id`);
CREATE INDEX `orders_customer_idx` ON `orders` (`customer_id`);
CREATE INDEX `orders_status_idx` ON `orders` (`status`);
CREATE INDEX `orders_branch_idx` ON `orders` (`branch_id`);
CREATE INDEX `payments_order_idx` ON `payments` (`order_id`);
CREATE INDEX `payments_status_idx` ON `payments` (`status`);
CREATE TABLE `menu_item_sizes` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`item_id` bigint unsigned NOT NULL,
	`size` varchar(32) NOT NULL,
	`price` decimal(12,2) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_item_sizes_id` PRIMARY KEY(`id`)
);
ALTER TABLE `menu_items` MODIFY COLUMN `price` decimal(12,2);
ALTER TABLE `menu_item_sizes` ADD CONSTRAINT `menu_item_sizes_item_id_menu_items_id_fk` FOREIGN KEY (`item_id`) REFERENCES `menu_items`(`id`) ON DELETE cascade ON UPDATE no action;
CREATE INDEX `menu_item_sizes_item_idx` ON `menu_item_sizes` (`item_id`);
-- Backfill: every existing menu item gets a single "Regular" size row carrying
-- its old flat price, so nothing on the public menu or in the admin loses its
-- price after this migration. The legacy `menu_items.price` column is left in
-- place (now nullable, no longer written to) rather than dropped.
INSERT INTO `menu_item_sizes` (`item_id`, `size`, `price`, `sort_order`)
SELECT `id`, 'Regular', `price`, 0
FROM `menu_items`
WHERE `price` IS NOT NULL;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- branches
INSERT INTO `branches` (`id`, `code`, `name`, `currency`) VALUES
(1, 'MAIN', 'Hamid Afandi — Main Branch', 'EGP');

-- permissions
INSERT INTO `permissions` (`id`, `slug`, `group`) VALUES
(1, 'dashboard.view', 'dashboard'),
(2, 'menu.view', 'menu'),
(3, 'menu.manage', 'menu'),
(4, 'store.view', 'store'),
(5, 'store.manage', 'store'),
(6, 'discounts.view', 'discounts'),
(7, 'discounts.manage', 'discounts'),
(8, 'orders.view', 'orders'),
(9, 'orders.manage', 'orders'),
(10, 'payments.view', 'payments'),
(11, 'payments.review', 'payments'),
(12, 'customers.view', 'customers'),
(13, 'customers.manage', 'customers'),
(14, 'media.view', 'media'),
(15, 'media.manage', 'media'),
(16, 'content.view', 'content'),
(17, 'content.manage', 'content'),
(18, 'users.view', 'users'),
(19, 'users.manage', 'users'),
(20, 'roles.manage', 'roles'),
(21, 'settings.manage', 'settings'),
(22, 'activity.view', 'activity');

-- roles
INSERT INTO `roles` (`id`, `name`, `slug`, `is_system`) VALUES
(1, 'Super Admin', 'super_admin', 1),
(2, 'Admin', 'admin', 1),
(3, 'Manager', 'manager', 1),
(4, 'Staff', 'staff', 1),
(5, 'Customer', 'customer', 1);

-- role_permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 21),
(2, 22),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 8),
(3, 9),
(3, 10),
(3, 11),
(3, 12),
(3, 14),
(3, 15),
(3, 16),
(3, 17),
(3, 22),
(4, 1),
(4, 8),
(4, 9),
(4, 10),
(4, 11),
(4, 12);

-- users (seeded Super Admin — CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN)
INSERT INTO `users` (`id`, `email`, `full_name`, `password_hash`, `status`, `email_verified_at`) VALUES
(1, 'hanarabeea707@gmail.com', 'Hamid Afandi Admin', '$2b$12$YUafNQQETXAYjdV6AeOOwuBxL66ZCM3CGRqliO78p3OJjlLrX390S', 'active', NOW());

-- user_roles
INSERT INTO `user_roles` (`id`, `user_id`, `role_id`) VALUES
(1, 1, 1);

-- payment_methods
INSERT INTO `payment_methods` (`id`, `code`, `name`, `is_active`, `sort_order`) VALUES
(1, 'cash_on_delivery', 'Cash on Delivery', 1, 1),
(2, 'instapay', 'InstaPay', 1, 2);

-- settings
INSERT INTO `settings` (`id`, `group`, `key`, `value`) VALUES
(1, 'site', 'name', '{"en":"Hamid Afandi","ar":"حامد أفندي"}'),
(2, 'site', 'default_locale', '"en"'),
(3, 'site', 'supported_locales', '["en","ar"]'),
(4, 'site', 'currency', '"EGP"'),
(5, 'checkout', 'tax_enabled', 'false'),
(6, 'checkout', 'fulfillment_types', '["delivery","pickup"]'),
(7, 'checkout', 'guest_checkout_enabled', 'true'),
(8, 'checkout', 'delivery_fee', '"30.00"');

-- menu category images / menu_categories / menu_category_translations / menu_items / menu_item_translations / menu_item_sizes
INSERT INTO `media` (`id`, `disk`, `bucket`, `object_key`, `url`, `mime`, `alt`, `folder`) VALUES
(101, 'external', '', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80', 'image/jpeg', 'Freshly roasted coffee beans', 'menu-categories'),
(102, 'external', '', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80', 'image/jpeg', 'Latte art in a warm cup', 'menu-categories'),
(103, 'external', '', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200&q=80', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200&q=80', 'image/jpeg', 'Iced coffee with condensation', 'menu-categories'),
(104, 'external', '', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=1200&q=80', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=1200&q=80', 'image/jpeg', 'Fresh fruit juices', 'menu-categories'),
(105, 'external', '', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=1200&q=80', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=1200&q=80', 'image/jpeg', 'Craft cocktail', 'menu-categories'),
(106, 'external', '', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=1200&q=80', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=1200&q=80', 'image/jpeg', 'Creamy milkshake', 'menu-categories'),
(107, 'external', '', 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=1200&q=80', 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=1200&q=80', 'image/jpeg', 'Fresh fruit smoothie', 'menu-categories'),
(108, 'external', '', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1200&q=80', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1200&q=80', 'image/jpeg', 'Chilled soft drinks', 'menu-categories'),
(109, 'external', '', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80', 'image/jpeg', 'Decadent dessert', 'menu-categories');
INSERT INTO `menu_categories` (`id`, `slug`, `icon`, `image_media_id`, `sort_order`, `is_active`) VALUES
(1, 'coffee', 'coffee', 101, 0, 1),
(2, 'hot-drinks', 'local_cafe', 102, 1, 1),
(3, 'iced-coffee', 'ac_unit', 103, 2, 1),
(4, 'fresh-juice', 'local_bar', 104, 3, 1),
(5, 'cocktails', 'wine_bar', 105, 4, 1),
(6, 'milkshakes', 'bakery_dining', 106, 5, 1),
(7, 'smoothies', 'blender', 107, 6, 1),
(8, 'soft-drinks', 'sports_bar', 108, 7, 1),
(9, 'desserts', 'cake', 109, 8, 1);
INSERT INTO `menu_category_translations` (`category_id`, `locale`, `name`) VALUES
(1, 'en', 'Coffee'),
(1, 'ar', 'القهوة'),
(2, 'en', 'Hot Drinks'),
(2, 'ar', 'المشروبات الساخنة'),
(3, 'en', 'Iced Coffee'),
(3, 'ar', 'القهوة المثلجة'),
(4, 'en', 'Fresh Juice'),
(4, 'ar', 'عصير طازج'),
(5, 'en', 'Cocktails'),
(5, 'ar', 'الموكتيلات'),
(6, 'en', 'Milkshakes'),
(6, 'ar', 'ميلك شيك'),
(7, 'en', 'Smoothies'),
(7, 'ar', 'سموذي'),
(8, 'en', 'Soft Drinks'),
(8, 'ar', 'المشروبات الغازية'),
(9, 'en', 'Desserts'),
(9, 'ar', 'الحلويات');
INSERT INTO `menu_items` (`id`, `category_id`, `slug`, `currency`, `badge`, `is_new`, `sort_order`, `is_active`) VALUES
(1, 1, 'espresso', 'EGP', 'Popular', 0, 0, 1),
(2, 1, 'double-espresso', 'EGP', NULL, 0, 1, 1),
(3, 1, 'americano', 'EGP', NULL, 0, 2, 1),
(4, 1, 'cappuccino', 'EGP', 'Popular', 0, 3, 1),
(5, 1, 'latte', 'EGP', NULL, 0, 4, 1),
(6, 1, 'flat-white', 'EGP', NULL, 0, 5, 1),
(7, 1, 'turkish-coffee', 'EGP', 'Heritage', 0, 6, 1),
(8, 1, 'arabic-coffee', 'EGP', NULL, 0, 7, 1),
(9, 2, 'hot-chocolate', 'EGP', NULL, 0, 0, 1),
(10, 2, 'matcha-latte', 'EGP', 'New', 1, 1, 1),
(11, 2, 'chai-latte', 'EGP', NULL, 0, 2, 1),
(12, 2, 'mint-tea', 'EGP', NULL, 0, 3, 1),
(13, 2, 'hibiscus', 'EGP', 'Heritage', 0, 4, 1),
(14, 2, 'anise-tea', 'EGP', NULL, 0, 5, 1),
(15, 3, 'cold-brew', 'EGP', 'Popular', 0, 0, 1),
(16, 3, 'iced-latte', 'EGP', NULL, 0, 1, 1),
(17, 3, 'iced-americano', 'EGP', NULL, 0, 2, 1),
(18, 3, 'iced-matcha', 'EGP', 'New', 1, 3, 1),
(19, 3, 'dalgona', 'EGP', NULL, 0, 4, 1),
(20, 3, 'espresso-tonic', 'EGP', 'Seasonal', 0, 5, 1),
(21, 4, 'orange-juice', 'EGP', 'Popular', 0, 0, 1),
(22, 4, 'mango-juice', 'EGP', 'Seasonal', 0, 1, 1),
(23, 4, 'sugarcane', 'EGP', 'Heritage', 0, 2, 1),
(24, 4, 'guava-juice', 'EGP', NULL, 0, 3, 1),
(25, 4, 'pomegranate', 'EGP', NULL, 0, 4, 1),
(26, 4, 'green-detox', 'EGP', 'New', 1, 5, 1),
(27, 5, 'virgin-mojito', 'EGP', 'Popular', 0, 0, 1),
(28, 5, 'passion-fruit-fizz', 'EGP', NULL, 0, 1, 1),
(29, 5, 'watermelon-basil', 'EGP', 'Seasonal', 0, 2, 1),
(30, 5, 'hibiscus-spritz', 'EGP', 'New', 1, 3, 1),
(31, 5, 'mango-chili', 'EGP', NULL, 0, 4, 1),
(32, 5, 'blue-lagoon', 'EGP', NULL, 0, 5, 1),
(33, 6, 'classic-vanilla', 'EGP', NULL, 0, 0, 1),
(34, 6, 'dark-chocolate-shake', 'EGP', 'Popular', 0, 1, 1),
(35, 6, 'salted-caramel-shake', 'EGP', NULL, 0, 2, 1),
(36, 6, 'lotus-shake', 'EGP', 'Popular', 0, 3, 1),
(37, 6, 'strawberry-shake', 'EGP', NULL, 0, 4, 1),
(38, 6, 'nutella-shake', 'EGP', NULL, 0, 5, 1),
(39, 7, 'tropical-blend', 'EGP', 'Popular', 0, 0, 1),
(40, 7, 'berry-blast', 'EGP', NULL, 0, 1, 1),
(41, 7, 'banana-peanut', 'EGP', 'New', 1, 2, 1),
(42, 7, 'avocado-banana', 'EGP', NULL, 0, 3, 1),
(43, 7, 'spinach-apple', 'EGP', NULL, 0, 4, 1),
(44, 8, 'cola', 'EGP', NULL, 0, 0, 1),
(45, 8, 'diet-cola', 'EGP', NULL, 0, 1, 1),
(46, 8, 'sparkling-water', 'EGP', NULL, 0, 2, 1),
(47, 8, 'still-water', 'EGP', NULL, 0, 3, 1),
(48, 8, 'lemon-soda', 'EGP', 'Popular', 0, 4, 1),
(49, 8, 'ginger-beer', 'EGP', NULL, 0, 5, 1),
(50, 8, 'energy', 'EGP', NULL, 0, 6, 1),
(51, 9, 'umm-ali', 'EGP', 'Heritage', 0, 0, 1),
(52, 9, 'kunafa', 'EGP', 'Popular', 0, 1, 1),
(53, 9, 'chocolate-fondant', 'EGP', NULL, 0, 2, 1),
(54, 9, 'lotus-cheesecake', 'EGP', 'Popular', 0, 3, 1),
(55, 9, 'tiramisu', 'EGP', NULL, 0, 4, 1),
(56, 9, 'basbousa', 'EGP', 'Heritage', 0, 5, 1),
(57, 9, 'creme-brulee', 'EGP', NULL, 0, 6, 1);
INSERT INTO `menu_item_translations` (`item_id`, `locale`, `name`, `description`) VALUES
(1, 'en', 'Espresso', 'A concentrated shot of rich, dark Egyptian-blend espresso.'),
(2, 'en', 'Double Espresso', 'Two concentrated shots for a deeper, bolder experience.'),
(3, 'en', 'Americano', 'Espresso diluted with hot water for a clean, smooth cup.'),
(4, 'en', 'Cappuccino', 'Equal parts espresso, steamed milk, and thick velvety foam.'),
(5, 'en', 'Café Latte', 'Smooth espresso with generous steamed milk and a light foam crown.'),
(6, 'en', 'Flat White', 'Ristretto shots with microfoam milk — intense and silky.'),
(7, 'en', 'Turkish Coffee', 'Traditional Egyptian-style coffee simmered in a cezve, served with cardamom.'),
(8, 'en', 'Arabic Coffee', 'Unfiltered, lightly roasted coffee with saffron and cardamom notes.'),
(9, 'en', 'Hot Chocolate', 'Rich dark chocolate melted into steamed whole milk.'),
(10, 'en', 'Matcha Latte', 'Ceremonial-grade matcha whisked with oat milk.'),
(11, 'en', 'Masala Chai Latte', 'Black tea with ginger, cinnamon, cardamom, and steamed milk.'),
(12, 'en', 'Fresh Mint Tea', 'A pot of boiling water with fresh Nile Valley spearmint.'),
(13, 'en', 'Karkadeh (Hibiscus)', 'Hot-brewed hibiscus flowers — tart, floral, deeply Egyptian.'),
(14, 'en', 'Anise Tea', 'Warming anise seeds brewed to a fragrant, comforting tisane.'),
(15, 'en', 'Cold Brew', '12-hour cold-steeped coffee — smooth, low-acidity, naturally sweet.'),
(16, 'en', 'Iced Latte', 'Double espresso over ice with chilled whole milk.'),
(17, 'en', 'Iced Americano', 'Espresso shots over ice with cold water. Clean and bold.'),
(18, 'en', 'Iced Matcha Latte', 'Ceremonial matcha shaken with oat milk over ice.'),
(19, 'en', 'Dalgona Coffee', 'Whipped instant coffee cloud over iced milk. Silky and indulgent.'),
(20, 'en', 'Espresso Tonic', 'Chilled tonic water topped with a ristretto shot. Unexpectedly refreshing.'),
(21, 'en', 'Fresh Orange Juice', 'Cold-pressed Valencia oranges. Nothing else.'),
(22, 'en', 'Mango Juice', 'Egyptian Alphonso mangoes blended fresh to order.'),
(23, 'en', 'Sugarcane Juice', 'Fresh-pressed sugarcane with a squeeze of lime.'),
(24, 'en', 'Guava Juice', 'Ripe Egyptian guava blended with a pinch of salt and lime.'),
(25, 'en', 'Pomegranate Juice', 'Cold-pressed ruby pomegranates — antioxidant-rich and vibrant.'),
(26, 'en', 'Green Detox', 'Cucumber, green apple, ginger, spinach, and mint.'),
(27, 'en', 'Virgin Mojito', 'Fresh mint, lime, brown sugar, soda water and a mountain of crushed ice.'),
(28, 'en', 'Passion Fruit Fizz', 'Passion fruit purée, vanilla syrup, tonic water, and lime.'),
(29, 'en', 'Watermelon Basil Smash', 'Muddled basil, fresh watermelon juice, lemon, and soda.'),
(30, 'en', 'Hibiscus Spritz', 'Karkadeh concentrate, elderflower, sparkling water, fresh mint.'),
(31, 'en', 'Mango Chili Cooler', 'Fresh mango, a pinch of chili, lime juice, and ginger beer.'),
(32, 'en', 'Blue Lagoon', 'Blue curaçao syrup, lemon juice, and lemonade. Striking and refreshing.'),
(33, 'en', 'Classic Vanilla', 'Madagascar vanilla bean ice cream blended to velvet perfection.'),
(34, 'en', 'Dark Chocolate', '70% dark chocolate ice cream with a dash of espresso.'),
(35, 'en', 'Salted Caramel', 'House-made caramel swirled with sea salt and vanilla ice cream.'),
(36, 'en', 'Lotus Biscoff', 'Creamy Biscoff spread blended with ice cream and topped with a cookie.'),
(37, 'en', 'Fresh Strawberry', 'Real strawberries blended with ice cream — no artificial flavour.'),
(38, 'en', 'Nutella Dream', 'Nutella, hazelnut ice cream, and a swirl of whipped cream.'),
(39, 'en', 'Tropical Blend', 'Mango, pineapple, passion fruit, and coconut milk.'),
(40, 'en', 'Mixed Berry Blast', 'Strawberry, blueberry, raspberry, and Greek yoghurt.'),
(41, 'en', 'Banana Peanut Butter', 'Frozen banana, natural peanut butter, oat milk, and honey.'),
(42, 'en', 'Avocado Banana', 'Creamy avocado, banana, honey, and almond milk.'),
(43, 'en', 'Spinach Apple Detox', 'Baby spinach, green apple, cucumber, lemon, and ginger.'),
(44, 'en', 'Coca-Cola', '330 ml chilled can.'),
(45, 'en', 'Diet Coke', '330 ml chilled can.'),
(46, 'en', 'Sparkling Water', '330 ml chilled can.'),
(47, 'en', 'Still Water', '500 ml chilled bottle.'),
(48, 'en', 'Lemon Mint Soda', 'Fresh lemon juice, mint leaves, and sparkling water over ice.'),
(49, 'en', 'Ginger Beer', '330 ml of spicy, natural ginger beer.'),
(50, 'en', 'Energy Drink', '250 ml chilled can.'),
(51, 'en', 'Umm Ali', 'Egypt\'s beloved bread pudding with cream, nuts, and raisins, served warm.'),
(52, 'en', 'Kunafa Slice', 'Shredded pastry with sweet cream cheese and rose-water syrup.'),
(53, 'en', 'Chocolate Fondant', 'Warm dark chocolate cake with a molten centre, served with vanilla ice cream.'),
(54, 'en', 'Lotus Cheesecake', 'New York-style cheesecake with a Biscoff crust and caramel drizzle.'),
(55, 'en', 'Tiramisu', 'Espresso-soaked ladyfingers with mascarpone cream and cocoa dust.'),
(56, 'en', 'Basbousa', 'Traditional Egyptian semolina cake soaked in rose-water syrup.'),
(57, 'en', 'Crème Brûlée', 'Vanilla custard with a perfectly caramelized sugar crust.');
INSERT INTO `menu_item_sizes` (`item_id`, `size`, `price`, `sort_order`) VALUES
(1, 'Regular', '45.00', 0),
(2, 'Regular', '60.00', 0),
(3, 'Regular', '55.00', 0),
(4, 'Regular', '75.00', 0),
(5, 'Regular', '80.00', 0),
(6, 'Regular', '85.00', 0),
(7, 'Regular', '50.00', 0),
(8, 'Regular', '55.00', 0),
(9, 'Regular', '75.00', 0),
(10, 'Regular', '90.00', 0),
(11, 'Regular', '70.00', 0),
(12, 'Regular', '40.00', 0),
(13, 'Regular', '45.00', 0),
(14, 'Regular', '40.00', 0),
(15, 'Regular', '85.00', 0),
(16, 'Regular', '80.00', 0),
(17, 'Regular', '65.00', 0),
(18, 'Regular', '95.00', 0),
(19, 'Regular', '90.00', 0),
(20, 'Regular', '95.00', 0),
(21, 'Regular', '65.00', 0),
(22, 'Regular', '70.00', 0),
(23, 'Regular', '55.00', 0),
(24, 'Regular', '60.00', 0),
(25, 'Regular', '80.00', 0),
(26, 'Regular', '85.00', 0),
(27, 'Regular', '75.00', 0),
(28, 'Regular', '85.00', 0),
(29, 'Regular', '80.00', 0),
(30, 'Regular', '90.00', 0),
(31, 'Regular', '85.00', 0),
(32, 'Regular', '80.00', 0),
(33, 'Regular', '85.00', 0),
(34, 'Regular', '95.00', 0),
(35, 'Regular', '95.00', 0),
(36, 'Regular', '105.00', 0),
(37, 'Regular', '90.00', 0),
(38, 'Regular', '105.00', 0),
(39, 'Regular', '90.00', 0),
(40, 'Regular', '90.00', 0),
(41, 'Regular', '95.00', 0),
(42, 'Regular', '100.00', 0),
(43, 'Regular', '85.00', 0),
(44, 'Regular', '35.00', 0),
(45, 'Regular', '35.00', 0),
(46, 'Regular', '30.00', 0),
(47, 'Regular', '20.00', 0),
(48, 'Regular', '50.00', 0),
(49, 'Regular', '55.00', 0),
(50, 'Regular', '65.00', 0),
(51, 'Regular', '85.00', 0),
(52, 'Regular', '75.00', 0),
(53, 'Regular', '120.00', 0),
(54, 'Regular', '110.00', 0),
(55, 'Regular', '115.00', 0),
(56, 'Regular', '55.00', 0),
(57, 'Regular', '110.00', 0);

-- store_categories / store_category_translations
INSERT INTO `store_categories` (`id`, `slug`, `sort_order`, `is_active`) VALUES
(1, 'beans', 0, 1),
(2, 'turkish', 1, 1),
(3, 'espresso', 2, 1),
(4, 'accessories', 3, 1),
(5, 'gifts', 4, 1);
INSERT INTO `store_category_translations` (`category_id`, `locale`, `name`) VALUES
(1, 'en', 'Coffee Beans'),
(1, 'ar', 'حبوب القهوة'),
(2, 'en', 'Turkish Coffee'),
(2, 'ar', 'قهوة تركي'),
(3, 'en', 'Espresso'),
(3, 'ar', 'إسبريسو'),
(4, 'en', 'Accessories'),
(4, 'ar', 'إكسسوارات'),
(5, 'en', 'Gifts'),
(5, 'ar', 'هدايا');

-- media / store_products / store_product_translations / store_product_media
INSERT INTO `media` (`id`, `disk`, `bucket`, `object_key`, `url`, `mime`, `alt`) VALUES
(1, 'external', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO3qDKQXh0zthabZhGghK70edShq3haEB1h7sRkctfUAUvCktpsQhD3od5976WV88c4RPNCIDUVXOiNGXtpupKNllLKdSxlA8U9NOZFVfGgfmrAubD3XVJx_WSeVw0oYszK-zZf8iJchMGQbziszcEzDxqeQ_hZKNQHlKu47tQPUFCAtCW0LkteupjF2PbRAvQSZPaP-4GP9ycLWUchY0LnUTMvXfNBq2s9LydUn-dzpdGPRA3yhlkMsZqL5rVMHl8aGGfdsUrcS22', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO3qDKQXh0zthabZhGghK70edShq3haEB1h7sRkctfUAUvCktpsQhD3od5976WV88c4RPNCIDUVXOiNGXtpupKNllLKdSxlA8U9NOZFVfGgfmrAubD3XVJx_WSeVw0oYszK-zZf8iJchMGQbziszcEzDxqeQ_hZKNQHlKu47tQPUFCAtCW0LkteupjF2PbRAvQSZPaP-4GP9ycLWUchY0LnUTMvXfNBq2s9LydUn-dzpdGPRA3yhlkMsZqL5rVMHl8aGGfdsUrcS22', 'image/jpeg', 'Afandi Signature Blend'),
(2, 'external', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEcBBEWYoqKB1g9SMRo-PBOPa4ygrijePGjVQHlqBLsct3adHO8IXO36ofvFEDaYptN7N_nUVhsv9dIOJZkUagHWR4OR3zJLKQBJE-tZfVIkVAHo3W6c3ufPAdFDUDOTiErcfancpKo0w_oQ_JaY_RZ7LuItoW1_l8uF2j4U6p5BO1Nl1GEPHhoRpLr0eUY-w_vBt5gVlLzFmeUixkO0jQh8-url9VXwC2ivbJxKe-oeCPcnfgvTAph2dfF3TEUloq7XEpwtU33MXX', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEcBBEWYoqKB1g9SMRo-PBOPa4ygrijePGjVQHlqBLsct3adHO8IXO36ofvFEDaYptN7N_nUVhsv9dIOJZkUagHWR4OR3zJLKQBJE-tZfVIkVAHo3W6c3ufPAdFDUDOTiErcfancpKo0w_oQ_JaY_RZ7LuItoW1_l8uF2j4U6p5BO1Nl1GEPHhoRpLr0eUY-w_vBt5gVlLzFmeUixkO0jQh8-url9VXwC2ivbJxKe-oeCPcnfgvTAph2dfF3TEUloq7XEpwtU33MXX', 'image/jpeg', 'Classic Espresso'),
(3, 'external', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCualFC7dUe4fOId29Fhv_WOObJt0A0oK4dwRpn-miWXPj9eq2pN5xoRpA3_l8SvX2KiLC2oSLHa9mLVO8JFPnrNvLqpoyKXKwPlY3kzuo1pW_LU_MtKNqaMDaqv4jQIuMCVBXgJzOthU0iAZqaYd29ZX1T2AbI0R1MFtRDBDtjn9K9P1soMoM4lYjmzBWUIJgd7vg6f6AVYSTbNlJNQPKBR2qMIx_OukUTSAbFAvIobhWHeAMXTrwaRCMz33szsIvdFsR1-7qmOzMN', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCualFC7dUe4fOId29Fhv_WOObJt0A0oK4dwRpn-miWXPj9eq2pN5xoRpA3_l8SvX2KiLC2oSLHa9mLVO8JFPnrNvLqpoyKXKwPlY3kzuo1pW_LU_MtKNqaMDaqv4jQIuMCVBXgJzOthU0iAZqaYd29ZX1T2AbI0R1MFtRDBDtjn9K9P1soMoM4lYjmzBWUIJgd7vg6f6AVYSTbNlJNQPKBR2qMIx_OukUTSAbFAvIobhWHeAMXTrwaRCMz33szsIvdFsR1-7qmOzMN', 'image/jpeg', 'Ethiopian Yirgacheffe'),
(4, 'external', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6dc5BR6VAl7cRiDRIVM4pSIIHTpg7b8RYXS20ztWO_P3OtC7qUGMd2V44NTMx0-P_m5nwIlykrzwYWJIXFu-4CrDblVg_UNuj1scSDJJwyOVnzCvlUUgLX8Ad01aQ9K6_ZWoj1jCsFNAjCc4XOyrsmkGQtlpJsGG4y4IzUMVGtUokfkDCfejKTmHyZ9dxKFbAdA-Qr4PtqIJCv6c3AmvKjwQY22Nsv4AoFIaZqNd38OjoNUguOpaUSsQQS19Ap0Bvg1gBqL-UzAFDw', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6dc5BR6VAl7cRiDRIVM4pSIIHTpg7b8RYXS20ztWO_P3OtC7qUGMd2V44NTMx0-P_m5nwIlykrzwYWJIXFu-4CrDblVg_UNuj1scSDJJwyOVnzCvlUUgLX8Ad01aQ9K6_ZWoj1jCsFNAjCc4XOyrsmkGQtlpJsGG4y4IzUMVGtUokfkDCfejKTmHyZ9dxKFbAdA-Qr4PtqIJCv6c3AmvKjwQY22Nsv4AoFIaZqNd38OjoNUguOpaUSsQQS19Ap0Bvg1gBqL-UzAFDw', 'image/jpeg', 'Heritage Grinder'),
(5, 'external', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzN0zQkS5k6B5_NdqcqnANAwA8Y4RujmzrSXJU2qOs0xAtV3EDM2Tf9LP8I7Jp0wV7ctqaTj5CB-dde9VsbPwyL-G9rrPab0Qi77-GVHdHSBrna-hUWNBuPucsdsFNJ_DlrDpEgx7F6xuOrFVN32rregDfUJgArLth4wZTH_GpF21o-5Ia3moH7M0pMGa0nkbSAphkneHNL_7TaiEMJdlJ6nczuibk6tjTg_gwwSYa2_gl3kz2EkMlaD6QmL7tARExqV9FhHuI2thQ', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzN0zQkS5k6B5_NdqcqnANAwA8Y4RujmzrSXJU2qOs0xAtV3EDM2Tf9LP8I7Jp0wV7ctqaTj5CB-dde9VsbPwyL-G9rrPab0Qi77-GVHdHSBrna-hUWNBuPucsdsFNJ_DlrDpEgx7F6xuOrFVN32rregDfUJgArLth4wZTH_GpF21o-5Ia3moH7M0pMGa0nkbSAphkneHNL_7TaiEMJdlJ6nczuibk6tjTg_gwwSYa2_gl3kz2EkMlaD6QmL7tARExqV9FhHuI2thQ', 'image/jpeg', 'Egyptian Gold'),
(6, 'external', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS_ICspq4E8s6psEzyun_WxdifdjFBoli9O5c9s65tenx-EJePiAHZ8apiZJNvUde2VHV7fWdc_ZiOqgesJjTGkF-VZ5fHhP3w5DcL_6hg2EdM4vb6opWU1nX5MuQY4QPhEpMP2t5cJwJFf2SPmjT8tVuTH285hiKDebeWo6gHn0o_n2QsAjnOAmKKpnI9CEC4PrlRPKhlfd4kjlF4uhvvXYcedrIkfnDKScVGCqfnqR0TNlLarQ_IgwPXD_AOJ2vEMbElf0Nd6DUY', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS_ICspq4E8s6psEzyun_WxdifdjFBoli9O5c9s65tenx-EJePiAHZ8apiZJNvUde2VHV7fWdc_ZiOqgesJjTGkF-VZ5fHhP3w5DcL_6hg2EdM4vb6opWU1nX5MuQY4QPhEpMP2t5cJwJFf2SPmjT8tVuTH285hiKDebeWo6gHn0o_n2QsAjnOAmKKpnI9CEC4PrlRPKhlfd4kjlF4uhvvXYcedrIkfnDKScVGCqfnqR0TNlLarQ_IgwPXD_AOJ2vEMbElf0Nd6DUY', 'image/jpeg', 'Cold Brew Blend'),
(7, 'external', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiUxYdYPBdh0V9WNd34EKGHQKGAdMdwOK0b1nO8dC7w0xfwmwoHOnWnMl2D-0OZoPzUPVLSCIWOqLibvlcA2hDq3ApPszTDhICfJqwJAsU2M-CRsxlpltdXp4XDu1huzt55NEQH_wEtLSXoIrqUhuoKvdKG9gK9mJcs-g5wSMrNPAoVrI7sJSV7588q8jxmX42Tf3SWjxGdWWYEQABrPN0OxUDNxR5I754ANF9AMHcYVZbbFZKk9huvsEQnpVAUxYeZJL66mgF2mVu', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiUxYdYPBdh0V9WNd34EKGHQKGAdMdwOK0b1nO8dC7w0xfwmwoHOnWnMl2D-0OZoPzUPVLSCIWOqLibvlcA2hDq3ApPszTDhICfJqwJAsU2M-CRsxlpltdXp4XDu1huzt55NEQH_wEtLSXoIrqUhuoKvdKG9gK9mJcs-g5wSMrNPAoVrI7sJSV7588q8jxmX42Tf3SWjxGdWWYEQABrPN0OxUDNxR5I754ANF9AMHcYVZbbFZKk9huvsEQnpVAUxYeZJL66mgF2mVu', 'image/jpeg', 'Modern Glass Set'),
(8, 'external', '', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ44YoDFCzS8xWko-C-YzrXd-o0wxnIxuPz-P_hqSda3BGfGGtL-6xry2vdVNByVllb2nsrww4TzcTmCHsNoiLxMi7o9Y8uB6184XU6TeOVaqOvMQYopWohq7zVA8n135XHAEfBTBjVYKndkSNl8xji6rALRinv0QNV7-VugHHsbqs-Ik_TqNrmLIOQFZwLSMeyRgUz6KggSbPexlP3Mcg1P9jNTdLC3EJqjssrYbdL34TFQA39EPUUrVgQH1u-seU444WJ5wvXjNP', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ44YoDFCzS8xWko-C-YzrXd-o0wxnIxuPz-P_hqSda3BGfGGtL-6xry2vdVNByVllb2nsrww4TzcTmCHsNoiLxMi7o9Y8uB6184XU6TeOVaqOvMQYopWohq7zVA8n135XHAEfBTBjVYKndkSNl8xji6rALRinv0QNV7-VugHHsbqs-Ik_TqNrmLIOQFZwLSMeyRgUz6KggSbPexlP3Mcg1P9jNTdLC3EJqjssrYbdL34TFQA39EPUUrVgQH1u-seU444WJ5wvXjNP', 'image/jpeg', 'Cairo Roast');
INSERT INTO `store_products` (`id`, `category_id`, `slug`, `price`, `currency`, `is_best_seller`, `is_featured_home`, `is_active`, `sort_order`, `stock_qty`, `rating`) VALUES
(1, 1, 'afandi-signature', '245.00', 'EGP', 1, 1, 1, 0, 100, '4.9'),
(2, 3, 'classic-espresso', '220.00', 'EGP', 0, 0, 1, 1, 100, '4.8'),
(3, 1, 'ethiopian-yirgacheffe', '310.00', 'EGP', 0, 0, 1, 2, 100, '5.0'),
(4, 4, 'heritage-grinder', '850.00', 'EGP', 0, 0, 1, 3, 100, '4.7'),
(5, 1, 'egyptian-gold', '280.00', 'EGP', 0, 0, 1, 4, 100, '4.9'),
(6, 1, 'cold-brew-blend', '195.00', 'EGP', 0, 0, 1, 5, 100, '4.6'),
(7, 4, 'modern-glass-set', '450.00', 'EGP', 0, 0, 1, 6, 100, '4.8'),
(8, 1, 'cairo-roast', '260.00', 'EGP', 0, 0, 1, 7, 100, '4.7');
INSERT INTO `store_product_translations` (`product_id`, `locale`, `name`, `description`) VALUES
(1, 'en', 'Afandi Signature Blend', 'Our flagship blend combining Ethiopian and Brazilian origins for a balanced, complex cup.'),
(2, 'en', 'Classic Espresso', 'Dark, rich and intensely aromatic. Perfect for those who love a strong, traditional cup.'),
(3, 'en', 'Ethiopian Yirgacheffe', 'Bright floral notes with a sparkling citrus acidity. Our most awarded single-origin.'),
(4, 'en', 'Heritage Grinder', 'Handcrafted copper grinder inspired by traditional Egyptian artisanship.'),
(5, 'en', 'Egyptian Gold', 'A bold, full-bodied blend with notes of dark chocolate and toasted nuts.'),
(6, 'en', 'Cold Brew Blend', 'Specifically crafted for long cold steeping. Smooth, sweet and incredibly refreshing.'),
(7, 'en', 'Modern Glass Set', 'Elegant double-walled glass cups that keep your espresso hot while staying cool to touch.'),
(8, 'en', 'Cairo Roast', 'Smoky, intense and deeply satisfying. The authentic taste of a Cairo evening.');
INSERT INTO `store_product_media` (`product_id`, `media_id`, `sort_order`, `is_primary`) VALUES
(1, 1, 0, 1),
(2, 2, 0, 1),
(3, 3, 0, 1),
(4, 4, 0, 1),
(5, 5, 0, 1),
(6, 6, 0, 1),
(7, 7, 0, 1),
(8, 8, 0, 1);

SET FOREIGN_KEY_CHECKS = 1;

