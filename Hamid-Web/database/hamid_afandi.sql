-- ============================================================================
-- Hamid Afandi — full database (schema + seed data)
-- Generated 2026-09-05T10:22:13.342Z by packages/db/src/generate-sql-dump.ts
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
-- SCHEMA (43 tables)
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
CREATE TABLE `user_permissions` (
	`user_id` bigint unsigned NOT NULL,
	`permission_id` bigint unsigned NOT NULL,
	CONSTRAINT `user_permissions_user_id_permission_id_pk` PRIMARY KEY(`user_id`,`permission_id`)
);
ALTER TABLE `branches` ADD `map_url` varchar(512);
ALTER TABLE `branches` ADD `hours` varchar(191);
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;
INSERT IGNORE INTO `permissions` (`slug`, `group`) VALUES ('branches.view', 'branches'), ('branches.manage', 'branches');
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`) SELECT r.`id`, p.`id` FROM `roles` r JOIN `permissions` p ON p.`slug` IN ('branches.view', 'branches.manage') WHERE r.`slug` IN ('super_admin', 'admin');
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`) SELECT r.`id`, p.`id` FROM `roles` r JOIN `permissions` p ON p.`slug` = 'branches.view' WHERE r.`slug` = 'manager';
CREATE TABLE `branch_locations` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`address` varchar(255),
	`hours` varchar(191),
	`map_url` varchar(512),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `branch_locations_id` PRIMARY KEY(`id`)
);
INSERT INTO `branch_locations` (`name`, `address`, `hours`, `map_url`) VALUES ('Mansoura Branch', 'Taksem Khattab, Mansoura', 'Open Daily', 'https://maps.google.com/?q=Taksem+Khattab+Mansoura');
CREATE TABLE `store_hero_images` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`uuid` char(36) NOT NULL DEFAULT (uuid()),
	`media_id` bigint unsigned NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `store_hero_images_id` PRIMARY KEY(`id`)
);
ALTER TABLE `store_hero_images` ADD CONSTRAINT `store_hero_images_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `branch_locations` ADD `name_ar` varchar(191);
ALTER TABLE `branch_locations` ADD `address_ar` varchar(255);
ALTER TABLE `banner_translations` ADD `cta_text_2` varchar(100);
ALTER TABLE `banners` ADD `link2_url` varchar(512);
ALTER TABLE `banners` ADD `image_link_url` varchar(512);

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
(21, 'branches.view', 'branches'),
(22, 'branches.manage', 'branches'),
(23, 'settings.manage', 'settings'),
(24, 'activity.view', 'activity');

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
(1, 23),
(1, 24),
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
(2, 23),
(2, 24),
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
(3, 21),
(3, 24),
(4, 1),
(4, 8),
(4, 9),
(4, 10),
(4, 11),
(4, 12);

-- users (seeded Super Admin — CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN)
INSERT INTO `users` (`id`, `email`, `full_name`, `password_hash`, `status`, `email_verified_at`) VALUES
(1, 'hanarabeea707@gmail.com', 'Hamid Afandi Admin', '$2b$12$7pf9C06VRZhrCjLd9HBb4edJuyeRMdTyj//.kLdK7sdCvvko/1eFi', 'active', NOW());

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
(101, 'external', '', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80', 'image/jpeg', 'Espresso and coffee drinks', 'menu-categories'),
(102, 'external', '', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80', 'image/jpeg', 'Warming hot beverages', 'menu-categories'),
(103, 'external', '', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80', 'image/jpeg', 'Traditional Turkish coffee', 'menu-categories'),
(104, 'external', '', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200&q=80', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200&q=80', 'image/jpeg', 'Refreshing iced coffee', 'menu-categories'),
(105, 'external', '', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=1200&q=80', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=1200&q=80', 'image/jpeg', 'Fresh fruit juices', 'menu-categories'),
(106, 'external', '', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=1200&q=80', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=1200&q=80', 'image/jpeg', 'Signature mocktails & cocktails', 'menu-categories'),
(107, 'external', '', 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=1200&q=80', 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=1200&q=80', 'image/jpeg', 'Hamid special fruit blends', 'menu-categories'),
(108, 'external', '', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=1200&q=80', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=1200&q=80', 'image/jpeg', 'Creamy rich milkshakes', 'menu-categories'),
(109, 'external', '', 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=1200&q=80', 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=1200&q=80', 'image/jpeg', 'Blended fruit smoothies', 'menu-categories'),
(110, 'external', '', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1200&q=80', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1200&q=80', 'image/jpeg', 'Chilled carbonated soft drinks', 'menu-categories'),
(111, 'external', '', 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=1200&q=80', 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=1200&q=80', 'image/jpeg', 'Extra toppings and additions', 'menu-categories'),
(112, 'external', '', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80', 'image/jpeg', 'Fresh pancakes and desserts', 'menu-categories'),
(113, 'external', '', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=1200&q=80', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=1200&q=80', 'image/jpeg', 'Crispy Belgian waffles with toppings', 'menu-categories');
INSERT INTO `menu_categories` (`id`, `slug`, `icon`, `image_media_id`, `sort_order`, `is_active`) VALUES
(1, 'espresso-coffee', 'coffee', 101, 0, 1),
(2, 'hot-drinks', 'local_cafe', 102, 1, 1),
(3, 'turkish-coffee', 'local_cafe', 103, 2, 1),
(4, 'iced-coffee', 'ac_unit', 104, 3, 1),
(5, 'fresh-juice', 'local_bar', 105, 4, 1),
(6, 'cocktails', 'wine_bar', 106, 5, 1),
(7, 'hamid-cocktails', 'auto_awesome', 107, 6, 1),
(8, 'milkshakes', 'bakery_dining', 108, 7, 1),
(9, 'smoothies', 'blender', 109, 8, 1),
(10, 'soft-drinks', 'sports_bar', 110, 9, 1),
(11, 'extras', 'add_circle', 111, 10, 1),
(12, 'desserts', 'cake', 112, 11, 1),
(13, 'waffles', 'cake', 113, 12, 1);
INSERT INTO `menu_category_translations` (`category_id`, `locale`, `name`) VALUES
(1, 'en', 'Espresso & Coffee'),
(1, 'ar', 'اسبريسو وقهوة'),
(2, 'en', 'Hot Drinks'),
(2, 'ar', 'مشروبات ساخنة'),
(3, 'en', 'Turkish Coffee'),
(3, 'ar', 'قهوة تركي'),
(4, 'en', 'Iced Coffee'),
(4, 'ar', 'قهوة باردة'),
(5, 'en', 'Fresh Juice'),
(5, 'ar', 'عصائر طازجة'),
(6, 'en', 'Cocktails'),
(6, 'ar', 'كوكتيلات'),
(7, 'en', 'Hamid Cocktails'),
(7, 'ar', 'كوكتيل حميد'),
(8, 'en', 'Milkshakes'),
(8, 'ar', 'ميلك شيك'),
(9, 'en', 'Smoothies'),
(9, 'ar', 'سموذي'),
(10, 'en', 'Soft Drinks'),
(10, 'ar', 'مشروبات غازية'),
(11, 'en', 'Extras & Additions'),
(11, 'ar', 'إضافات'),
(12, 'en', 'Desserts & Pancakes'),
(12, 'ar', 'حلويات'),
(13, 'en', 'Waffles'),
(13, 'ar', 'وافل');
INSERT INTO `menu_items` (`id`, `category_id`, `slug`, `currency`, `badge`, `is_new`, `sort_order`, `is_active`) VALUES
(1, 1, 'cappuccino', 'EGP', NULL, 0, 0, 1),
(2, 1, 'macchiato', 'EGP', NULL, 0, 1, 1),
(3, 1, 'flavored-cappuccino', 'EGP', NULL, 0, 2, 1),
(4, 1, 'caramel-mocha', 'EGP', NULL, 0, 3, 1),
(5, 1, 'espresso', 'EGP', NULL, 0, 4, 1),
(6, 1, 'café-latte', 'EGP', NULL, 0, 5, 1),
(7, 1, 'nescafe', 'EGP', NULL, 0, 6, 1),
(8, 1, 'american-coffee', 'EGP', NULL, 0, 7, 1),
(9, 1, 'فلات-وايت', 'EGP', NULL, 0, 8, 1),
(10, 1, 'كورتادو', 'EGP', NULL, 0, 9, 1),
(11, 2, 'flavored-tea', 'EGP', NULL, 0, 0, 1),
(12, 2, 'hot-oreo', 'EGP', NULL, 0, 1, 1),
(13, 2, 'hot-caramel', 'EGP', NULL, 0, 2, 1),
(14, 2, 'tea-latte', 'EGP', NULL, 0, 3, 1),
(15, 2, 'سحلب', 'EGP', NULL, 0, 4, 1),
(16, 2, 'herbal-tea', 'EGP', NULL, 0, 5, 1),
(17, 2, 'hot-cider', 'EGP', NULL, 0, 6, 1),
(18, 2, 'hot-chocolate', 'EGP', NULL, 0, 7, 1),
(19, 2, 'قرفة-حليب', 'EGP', NULL, 0, 8, 1),
(20, 2, 'شاى-اخضر', 'EGP', NULL, 0, 9, 1),
(21, 2, 'كركديه', 'EGP', NULL, 0, 10, 1),
(22, 2, 'tea', 'EGP', NULL, 0, 11, 1),
(23, 2, 'كوفي-مكس', 'EGP', NULL, 0, 12, 1),
(24, 3, 'hazelnut-french-coffee', 'EGP', NULL, 0, 0, 1),
(25, 3, 'hamid-spiced-turkish-coffee', 'EGP', NULL, 0, 1, 1),
(26, 3, 'classic-french-coffee', 'EGP', NULL, 0, 2, 1),
(27, 3, 'pure-plain-colombian-coffee', 'EGP', NULL, 0, 3, 1),
(28, 3, 'hamid-plain-turkish-coffee', 'EGP', NULL, 0, 4, 1),
(29, 3, 'nuts-french-coffee', 'EGP', NULL, 0, 5, 1),
(30, 4, 'hamid-special-iced-mix', 'EGP', NULL, 0, 0, 1),
(31, 4, 'iced-coffee', 'EGP', NULL, 0, 1, 1),
(32, 4, 'iced-cappuccino', 'EGP', NULL, 0, 2, 1),
(33, 4, 'iced-latte', 'EGP', NULL, 0, 3, 1),
(34, 4, 'iced-mocha', 'EGP', NULL, 0, 4, 1),
(35, 4, 'فرابي', 'EGP', NULL, 0, 5, 1),
(36, 4, 'iced-caramel-mocha', 'EGP', NULL, 0, 6, 1),
(37, 4, 'سبانش-لاتيه', 'EGP', NULL, 0, 7, 1),
(38, 4, 'أيس-امريكانو', 'EGP', NULL, 0, 8, 1),
(39, 5, 'strawberry-juice', 'EGP', NULL, 0, 0, 1),
(40, 5, 'watermelon-juice', 'EGP', NULL, 0, 1, 1),
(41, 5, 'fresh-orange-juice', 'EGP', NULL, 0, 2, 1),
(42, 5, 'guava-juice', 'EGP', NULL, 0, 3, 1),
(43, 5, 'banana-milkshake-juice', 'EGP', NULL, 0, 4, 1),
(44, 5, 'lemon-mint', 'EGP', NULL, 0, 5, 1),
(45, 5, 'banana-yogurt-smoothie', 'EGP', NULL, 0, 6, 1),
(46, 5, 'strawberry-yogurt-smoothie', 'EGP', NULL, 0, 7, 1),
(47, 5, 'peach-yogurt-smoothie', 'EGP', NULL, 0, 8, 1),
(48, 5, 'mango-yogurt-smoothie', 'EGP', NULL, 0, 9, 1),
(49, 5, 'mango-juice', 'EGP', NULL, 0, 10, 1),
(50, 5, 'cantaloupe-juice', 'EGP', NULL, 0, 11, 1),
(51, 5, 'fresh-lemonade', 'EGP', NULL, 0, 12, 1),
(52, 5, 'عناب', 'EGP', NULL, 0, 13, 1),
(53, 5, 'سوبيا', 'EGP', NULL, 0, 14, 1),
(54, 5, 'بلح-بلبن', 'EGP', NULL, 0, 15, 1),
(55, 5, 'berry-yogurt-smoothie', 'EGP', NULL, 0, 16, 1),
(56, 5, 'افوكادو', 'EGP', NULL, 0, 17, 1),
(57, 6, 'cherry-cola-mocktail', 'EGP', NULL, 0, 0, 1),
(58, 6, 'power-mojito', 'EGP', NULL, 0, 1, 1),
(59, 6, 'florida-mocktail', 'EGP', NULL, 0, 2, 1),
(60, 6, 'hawaii-mocktail', 'EGP', NULL, 0, 3, 1),
(61, 6, 'sunshine-mocktail', 'EGP', NULL, 0, 4, 1),
(62, 6, 'tutti-frutti', 'EGP', NULL, 0, 5, 1),
(63, 6, 'soda-cocktail', 'EGP', NULL, 0, 6, 1),
(64, 6, 'hamid-special-cocktail', 'EGP', NULL, 0, 7, 1),
(65, 6, 'classic-mojito', 'EGP', NULL, 0, 8, 1),
(66, 6, 'افوكادو-ميكس', 'EGP', NULL, 0, 9, 1),
(67, 7, 'sobia-strawberry', 'EGP', NULL, 0, 0, 1),
(68, 7, 'guava-lemon', 'EGP', NULL, 0, 1, 1),
(69, 7, 'mango-banana', 'EGP', NULL, 0, 2, 1),
(70, 7, 'mango-strawberry', 'EGP', NULL, 0, 3, 1),
(71, 7, 'banana-strawberry', 'EGP', NULL, 0, 4, 1),
(72, 7, 'sobia-mango', 'EGP', NULL, 0, 5, 1),
(73, 7, 'مانجو-كيوي', 'EGP', NULL, 0, 6, 1),
(74, 7, 'مانجو-خوخ', 'EGP', NULL, 0, 7, 1),
(75, 7, 'مانجو-باشون', 'EGP', NULL, 0, 8, 1),
(76, 7, 'بلح-موز', 'EGP', NULL, 0, 9, 1),
(77, 8, 'oreo-milkshake', 'EGP', NULL, 0, 0, 1),
(78, 8, 'berry-milkshake', 'EGP', NULL, 0, 1, 1),
(79, 8, 'caramel-milkshake', 'EGP', NULL, 0, 2, 1),
(80, 8, 'nutella-milkshake', 'EGP', NULL, 0, 3, 1),
(81, 8, 'lotus-biscoff-milkshake', 'EGP', NULL, 0, 4, 1),
(82, 8, 'strawberry-juice', 'EGP', NULL, 0, 5, 1),
(83, 8, 'mango-juice', 'EGP', NULL, 0, 6, 1),
(84, 8, 'chocolate-milkshake', 'EGP', NULL, 0, 7, 1),
(85, 8, 'vanilla-milkshake', 'EGP', NULL, 0, 8, 1),
(86, 9, 'fresh-lemonade', 'EGP', NULL, 0, 0, 1),
(87, 9, 'lemon-mint', 'EGP', NULL, 0, 1, 1),
(88, 9, 'blueberry-smoothie', 'EGP', NULL, 0, 2, 1),
(89, 9, 'strawberry-juice', 'EGP', NULL, 0, 3, 1),
(90, 9, 'passion-fruit-smoothie', 'EGP', NULL, 0, 4, 1),
(91, 9, 'watermelon-juice', 'EGP', NULL, 0, 5, 1),
(92, 9, 'خوخ', 'EGP', NULL, 0, 6, 1),
(93, 9, 'mango-juice', 'EGP', NULL, 0, 7, 1),
(94, 9, 'كيوي', 'EGP', NULL, 0, 8, 1),
(95, 9, 'اناناس', 'EGP', NULL, 0, 9, 1),
(96, 9, 'مكس-بيري', 'EGP', NULL, 0, 10, 1),
(97, 10, 'fayrouz-malt-drink', 'EGP', NULL, 0, 0, 1),
(98, 10, 'red-bull', 'EGP', NULL, 0, 1, 1),
(99, 10, 'mineral-water', 'EGP', NULL, 0, 2, 1),
(100, 10, 'birell-malt-drink', 'EGP', NULL, 0, 3, 1),
(101, 10, 'فولت', 'EGP', NULL, 0, 4, 1),
(102, 10, 'تويست', 'EGP', NULL, 0, 5, 1),
(103, 10, 'v7-flavored-soda', 'EGP', NULL, 0, 6, 1),
(104, 11, 'extra-milk', 'EGP', NULL, 0, 0, 1),
(105, 11, 'ice-cream-scoop', 'EGP', NULL, 0, 1, 1),
(106, 11, 'extra-sauce', 'EGP', NULL, 0, 2, 1),
(107, 11, 'extra-nuts', 'EGP', NULL, 0, 3, 1),
(108, 11, 'lotus-biscoff-milkshake', 'EGP', NULL, 0, 4, 1),
(109, 12, 'pancakes-12-pcs', 'EGP', NULL, 0, 0, 1),
(110, 12, 'pancakes-6-pcs', 'EGP', NULL, 0, 1, 1),
(111, 12, 'pancakes-25-pcs', 'EGP', NULL, 0, 2, 1),
(112, 13, 'banana-waffle', 'EGP', NULL, 0, 0, 1),
(113, 13, 'fruit-waffle', 'EGP', NULL, 0, 1, 1),
(114, 13, 'ice-cream-waffle-4-flavors', 'EGP', NULL, 0, 2, 1),
(115, 13, 'hamid-special-waffle', 'EGP', NULL, 0, 3, 1),
(116, 13, 'lotus-biscoff-milkshake', 'EGP', NULL, 0, 4, 1),
(117, 13, 'white-chocolate-waffle', 'EGP', NULL, 0, 5, 1),
(118, 13, 'nutella-milkshake', 'EGP', NULL, 0, 6, 1),
(119, 13, 'oreo-milkshake', 'EGP', NULL, 0, 7, 1);
INSERT INTO `menu_item_translations` (`item_id`, `locale`, `name`, `description`) VALUES
(1, 'en', 'Cappuccino', 'Equal parts espresso, steamed milk, and velvety foam.'),
(1, 'ar', 'كابتشينو', 'كابتشينو'),
(2, 'en', 'Macchiato', 'Espresso stained with a dollop of milk foam.'),
(2, 'ar', 'ميكاتو', 'ميكاتو'),
(3, 'en', 'Flavored Cappuccino', 'Rich cappuccino infused with your choice of flavor.'),
(3, 'ar', 'كابتشينو نكهات', 'كابتشينو نكهات'),
(4, 'en', 'Caramel Mocha', 'Espresso blended with rich chocolate and caramel syrup.'),
(4, 'ar', 'موكا كراميل', 'موكا كراميل'),
(5, 'en', 'Espresso', 'Rich concentrated shot of dark espresso.'),
(5, 'ar', 'اسبريسو', 'اسبريسو'),
(6, 'en', 'Café Latte', 'Smooth espresso with velvety steamed milk crown.'),
(6, 'ar', 'كافي لاتيه', 'كافي لاتيه'),
(7, 'en', 'Nescafe', 'Classic instant coffee brewed to warmth.'),
(7, 'ar', 'نسكافيه', 'نسكافيه'),
(8, 'en', 'American Coffee', 'Espresso diluted with hot water for a smooth brew.'),
(8, 'ar', 'اميريكان كوفي', 'اميريكان كوفي'),
(9, 'en', 'فلات وايت', 'Delicious فلات وايت from Hamid Afandi.'),
(9, 'ar', 'فلات وايت', 'فلات وايت'),
(10, 'en', 'كورتادو', 'Delicious كورتادو from Hamid Afandi.'),
(10, 'ar', 'كورتادو', 'كورتادو'),
(11, 'en', 'Flavored Tea', 'Fragrant black tea with custom fruit/mint flavor.'),
(11, 'ar', 'شاي بنكهة', 'شاي بنكهة'),
(12, 'en', 'Hot Oreo', 'Decadent crushed Oreo cookies melted in hot milk.'),
(12, 'ar', 'أوريو ساخن', 'أوريو ساخن'),
(13, 'en', 'Hot Caramel', 'Warm sweet milk swirled with buttery caramel.'),
(13, 'ar', 'كراميل ساخن', 'كراميل ساخن'),
(14, 'en', 'Tea Latte', 'Steamed spiced tea with creamy milk.'),
(14, 'ar', 'شاي لاتيه', 'شاي لاتيه'),
(15, 'en', 'سحلب', 'Delicious سحلب from Hamid Afandi.'),
(15, 'ar', 'سحلب', 'سحلب'),
(16, 'en', 'Herbal Tea', 'Soothing selection of natural herbs.'),
(16, 'ar', 'أعشاب', 'أعشاب'),
(17, 'en', 'Hot Cider', 'Warming spiced apple cider served piping hot.'),
(17, 'ar', 'سايدر ساخن', 'سايدر ساخن'),
(18, 'en', 'Hot Chocolate', 'Melted dark cocoa with creamy warm milk.'),
(18, 'ar', 'شوكولاتة ساخنة', 'شوكولاتة ساخنة'),
(19, 'en', 'قرفة حليب', 'Delicious قرفة حليب from Hamid Afandi.'),
(19, 'ar', 'قرفة حليب', 'قرفة حليب'),
(20, 'en', 'شاى اخضر', 'Delicious شاى اخضر from Hamid Afandi.'),
(20, 'ar', 'شاى اخضر', 'شاى اخضر'),
(21, 'en', 'كركديه', 'Delicious كركديه from Hamid Afandi.'),
(21, 'ar', 'كركديه', 'كركديه'),
(22, 'en', 'Tea', 'Freshly brewed black Egyptian tea.'),
(22, 'ar', 'شاي', 'شاي'),
(23, 'en', 'كوفي مكس', 'Delicious كوفي مكس from Hamid Afandi.'),
(23, 'ar', 'كوفي مكس', 'كوفي مكس'),
(24, 'en', 'Hazelnut French Coffee', 'French coffee infused with rich hazelnut flavor.'),
(24, 'ar', 'قهوة فرنسي بندق', 'قهوة فرنسي بندق'),
(25, 'en', 'Hamid Spiced Turkish Coffee', 'Traditional Turkish coffee infused with cardamom and spices.'),
(25, 'ar', 'قهوة حميد محوج', 'قهوة حميد محوج'),
(26, 'en', 'Classic French Coffee', 'Creamy French coffee brewed with whole milk.'),
(26, 'ar', 'قهوة فرنسي كلاسيك', 'قهوة فرنسي كلاسيك'),
(27, 'en', 'Pure Plain Colombian Coffee', 'Premium Colombian dark roasted coffee, pure and smooth.'),
(27, 'ar', 'قهوة كولومبي بيور سادة', 'قهوة كولومبي بيور سادة'),
(28, 'en', 'Hamid Plain Turkish Coffee', 'Authentic Egyptian-style plain Turkish coffee simmered in cezve.'),
(28, 'ar', 'قهوة حميد سادة', 'قهوة حميد سادة'),
(29, 'en', 'Nuts French Coffee', 'French coffee blended with fine roasted nuts.'),
(29, 'ar', 'قهوة فرنسي مكسرات', 'قهوة فرنسي مكسرات'),
(30, 'en', 'Hamid Special Iced Mix', 'Hamid afandi exclusive secret cold coffee creation.'),
(30, 'ar', 'افتكاسة حميد', 'افتكاسة حميد'),
(31, 'en', 'Iced Coffee', 'Chilled espresso poured over cold water and ice.'),
(31, 'ar', 'آيس كوفي', 'آيس كوفي'),
(32, 'en', 'Iced Cappuccino', 'Iced espresso topped with cold frothy milk foam.'),
(32, 'ar', 'آيس كابتشينو', 'آيس كابتشينو'),
(33, 'en', 'Iced Latte', 'Double espresso with chilled whole milk over ice.'),
(33, 'ar', 'آيس لاتيه', 'آيس لاتيه'),
(34, 'en', 'Iced Mocha', 'Espresso, dark chocolate, and cold milk over ice.'),
(34, 'ar', 'آيس موكا', 'آيس موكا'),
(35, 'en', 'فرابي', 'Delicious فرابي from Hamid Afandi.'),
(35, 'ar', 'فرابي', 'فرابي'),
(36, 'en', 'Iced Caramel Mocha', 'Espresso, chocolate, and caramel sauce served over ice.'),
(36, 'ar', 'آيس موكا كراميل', 'آيس موكا كراميل'),
(37, 'en', 'سبانش لاتيه', 'Delicious سبانش لاتيه from Hamid Afandi.'),
(37, 'ar', 'سبانش لاتيه', 'سبانش لاتيه'),
(38, 'en', 'أيس امريكانو', 'Delicious أيس امريكانو from Hamid Afandi.'),
(38, 'ar', 'أيس امريكانو', 'أيس امريكانو'),
(39, 'en', 'Strawberry Juice', 'Freshly blended sweet strawberry juice.'),
(39, 'ar', 'فراولة', 'فراولة'),
(40, 'en', 'Watermelon Juice', 'Refreshing cold pressed watermelon juice.'),
(40, 'ar', 'بطيخ', 'بطيخ'),
(41, 'en', 'Fresh Orange Juice', '100% natural cold-pressed orange juice.'),
(41, 'ar', 'برتقال', 'برتقال'),
(42, 'en', 'Guava Juice', 'Ripe Egyptian guava juice with a hint of lime.'),
(42, 'ar', 'جوافة', 'جوافة'),
(43, 'en', 'Banana Milkshake Juice', 'Fresh bananas blended smooth with cold milk.'),
(43, 'ar', 'موز باللبن', 'موز باللبن'),
(44, 'en', 'Lemon Mint', 'Fresh lemonade crushed with garden spearmint.'),
(44, 'ar', 'ليمون نعناع', 'ليمون نعناع'),
(45, 'en', 'Banana Yogurt Smoothie', 'Creamy yogurt blended with fresh banana.'),
(45, 'ar', 'زبادي موز', 'زبادي موز'),
(46, 'en', 'Strawberry Yogurt Smoothie', 'Creamy yogurt blended with ripe strawberries.'),
(46, 'ar', 'زبادي فراولة', 'زبادي فراولة'),
(47, 'en', 'Peach Yogurt Smoothie', 'Refreshing yogurt blended with sweet peach.'),
(47, 'ar', 'زبادي خوخ', 'زبادي خوخ'),
(48, 'en', 'Mango Yogurt Smoothie', 'Creamy yogurt blended with fresh mango.'),
(48, 'ar', 'زبادي مانجا', 'زبادي مانجا'),
(49, 'en', 'Mango Juice', 'Freshly squeezed Egyptian Alphonso mango juice.'),
(49, 'ar', 'مانجو', 'مانجو'),
(50, 'en', 'Cantaloupe Juice', 'Sweet cantaloupe melon juice served chilled.'),
(50, 'ar', 'كنتالوب', 'كنتالوب'),
(51, 'en', 'Fresh Lemonade', 'Zesty fresh-squeezed Egyptian lemonade.'),
(51, 'ar', 'ليمون', 'ليمون'),
(52, 'en', 'عناب', 'Delicious عناب from Hamid Afandi.'),
(52, 'ar', 'عناب', 'عناب'),
(53, 'en', 'سوبيا', 'Delicious سوبيا from Hamid Afandi.'),
(53, 'ar', 'سوبيا', 'سوبيا'),
(54, 'en', 'بلح بلبن', 'Delicious بلح بلبن from Hamid Afandi.'),
(54, 'ar', 'بلح بلبن', 'بلح بلبن'),
(55, 'en', 'Berry Yogurt Smoothie', 'Yogurt blended with rich wild berries.'),
(55, 'ar', 'زبادي توت', 'زبادي توت'),
(56, 'en', 'افوكادو', 'Delicious افوكادو from Hamid Afandi.'),
(56, 'ar', 'افوكادو', 'افوكادو'),
(57, 'en', 'Cherry Cola Mocktail', 'Classic fizzy cola infused with sweet cherry syrup.'),
(57, 'ar', 'شيري كولا', 'شيري كولا'),
(58, 'en', 'Power Mojito', 'Energy boosting mint, lime, and crushed ice mojito.'),
(58, 'ar', 'باور موخيتو', 'باور موخيتو'),
(59, 'en', 'Florida Mocktail', 'Vibrant tropical fruit cocktail with soda.'),
(59, 'ar', 'فلوريدا', 'فلوريدا'),
(60, 'en', 'Hawaii Mocktail', 'Exotic pineapple and coconut tropical fizz.'),
(60, 'ar', 'هاواي', 'هاواي'),
(61, 'en', 'Sunshine Mocktail', 'Bright orange, passionfruit, and grenadine spritz.'),
(61, 'ar', 'صن شاين', 'صن شاين'),
(62, 'en', 'Tutti Frutti', 'Extravagant mixed fruit cocktail with crushed ice.'),
(62, 'ar', 'توتي فروتي', 'توتي فروتي'),
(63, 'en', 'Soda Cocktail', 'Sparkling fruit soda with ice and citrus.'),
(63, 'ar', 'كوكتيل صودا', 'كوكتيل صودا'),
(64, 'en', 'Hamid Special Cocktail', 'Hamid Afandi flagship ultimate fruit blend.'),
(64, 'ar', 'كوكتيل حميد', 'كوكتيل حميد'),
(65, 'en', 'Classic Mojito', 'Refreshing spearmint, lime, and sparkling soda.'),
(65, 'ar', 'موخيتو', 'موخيتو'),
(66, 'en', 'افوكادو ميكس', 'Delicious افوكادو ميكس from Hamid Afandi.'),
(66, 'ar', 'افوكادو ميكس', 'افوكادو ميكس'),
(67, 'en', 'Sobia Strawberry', 'Sweet Sobia coconut drink swirled with fresh strawberry.'),
(67, 'ar', 'سوبيا فراولة', 'سوبيا فراولة'),
(68, 'en', 'Guava Lemon', 'Zesty lemon combined with creamy Egyptian guava.'),
(68, 'ar', 'جوافة ليمون', 'جوافة ليمون'),
(69, 'en', 'Mango Banana', 'Rich mango puree blended with ripe banana.'),
(69, 'ar', 'مانجو موز', 'مانجو موز'),
(70, 'en', 'Mango Strawberry', 'Layered fresh mango and strawberry juice.'),
(70, 'ar', 'مانجو فراولة', 'مانجو فراولة'),
(71, 'en', 'Banana Strawberry', 'Classic sweet banana and strawberry blend.'),
(71, 'ar', 'موز فراولة', 'موز فراولة'),
(72, 'en', 'Sobia Mango', 'Traditional Egyptian Sobia coconut milk blended with mango.'),
(72, 'ar', 'سوبيا مانجو', 'سوبيا مانجو'),
(73, 'en', 'مانجو كيوي', 'Delicious مانجو كيوي from Hamid Afandi.'),
(73, 'ar', 'مانجو كيوي', 'مانجو كيوي'),
(74, 'en', 'مانجو خوخ', 'Delicious مانجو خوخ from Hamid Afandi.'),
(74, 'ar', 'مانجو خوخ', 'مانجو خوخ'),
(75, 'en', 'مانجو باشون', 'Delicious مانجو باشون from Hamid Afandi.'),
(75, 'ar', 'مانجو باشون', 'مانجو باشون'),
(76, 'en', 'بلح موز', 'Delicious بلح موز from Hamid Afandi.'),
(76, 'ar', 'بلح موز', 'بلح موز'),
(77, 'en', 'Oreo Milkshake', 'Crushed Oreo cookies blended with vanilla ice cream.'),
(77, 'ar', 'اوريو', 'اوريو'),
(78, 'en', 'Berry Milkshake', 'Wild berry preserve blended with rich cream.'),
(78, 'ar', 'توت', 'توت'),
(79, 'en', 'Caramel Milkshake', 'Creamy ice cream blended with golden caramel.'),
(79, 'ar', 'كراميل', 'كراميل'),
(80, 'en', 'Nutella Milkshake', 'Authentic Nutella hazelnut cocoa cream shake.'),
(80, 'ar', 'نوتيلا', 'نوتيلا'),
(81, 'en', 'Lotus Biscoff Milkshake', 'Biscoff cookie spread blended into thick milkshake.'),
(81, 'ar', 'لوتس', 'لوتس'),
(82, 'en', 'Strawberry Juice', 'Freshly blended sweet strawberry juice.'),
(82, 'ar', 'فراولة', 'فراولة'),
(83, 'en', 'Mango Juice', 'Freshly squeezed Egyptian Alphonso mango juice.'),
(83, 'ar', 'مانجو', 'مانجو'),
(84, 'en', 'Chocolate Milkshake', 'Rich dark chocolate ice cream milkshake.'),
(84, 'ar', 'شوكليت', 'شوكليت'),
(85, 'en', 'Vanilla Milkshake', 'Creamy Madagascar vanilla bean ice cream shake.'),
(85, 'ar', 'فانيليا', 'فانيليا'),
(86, 'en', 'Fresh Lemonade', 'Zesty fresh-squeezed Egyptian lemonade.'),
(86, 'ar', 'ليمون', 'ليمون'),
(87, 'en', 'Lemon Mint', 'Fresh lemonade crushed with garden spearmint.'),
(87, 'ar', 'ليمون نعناع', 'ليمون نعناع'),
(88, 'en', 'Blueberry Smoothie', 'Antioxidant-rich wild blueberry icy smoothie.'),
(88, 'ar', 'بلوبيري', 'بلوبيري'),
(89, 'en', 'Strawberry Juice', 'Freshly blended sweet strawberry juice.'),
(89, 'ar', 'فراولة', 'فراولة'),
(90, 'en', 'Passion Fruit Smoothie', 'Exotic passion fruit blended with crushed ice.'),
(90, 'ar', 'باشن فروت', 'باشن فروت'),
(91, 'en', 'Watermelon Juice', 'Refreshing cold pressed watermelon juice.'),
(91, 'ar', 'بطيخ', 'بطيخ'),
(92, 'en', 'خوخ', 'Delicious خوخ from Hamid Afandi.'),
(92, 'ar', 'خوخ', 'خوخ'),
(93, 'en', 'Mango Juice', 'Freshly squeezed Egyptian Alphonso mango juice.'),
(93, 'ar', 'مانجو', 'مانجو'),
(94, 'en', 'كيوي', 'Delicious كيوي from Hamid Afandi.'),
(94, 'ar', 'كيوي', 'كيوي'),
(95, 'en', 'اناناس', 'Delicious اناناس from Hamid Afandi.'),
(95, 'ar', 'اناناس', 'اناناس'),
(96, 'en', 'مكس بيري', 'Delicious مكس بيري from Hamid Afandi.'),
(96, 'ar', 'مكس بيري', 'مكس بيري'),
(97, 'en', 'Fayrouz Malt Drink', 'Sparkling flavored malt beverage 330ml.'),
(97, 'ar', 'فيروز', 'فيروز'),
(98, 'en', 'Red Bull', 'Original Red Bull energy drink 250ml.'),
(98, 'ar', 'ريدبول', 'ريدبول'),
(99, 'en', 'Mineral Water', 'Pure bottled natural spring water 500ml.'),
(99, 'ar', 'مياه معدنية', 'مياه معدنية'),
(100, 'en', 'Birell Malt Drink', 'Non-alcoholic barley malt beverage 330ml.'),
(100, 'ar', 'بريل', 'بريل'),
(101, 'en', 'فولت', 'Delicious فولت from Hamid Afandi.'),
(101, 'ar', 'فولت', 'فولت'),
(102, 'en', 'تويست', 'Delicious تويست from Hamid Afandi.'),
(102, 'ar', 'تويست', 'تويست'),
(103, 'en', 'V7 Flavored Soda', 'V7 sparkling drink with cola, pomegranate & pina colada flavor.'),
(103, 'ar', 'V7 (كولا+رمان+بينا كولادا+جوز هند)', 'V7 (كولا+رمان+بينا كولادا+جوز هند)'),
(104, 'en', 'Extra Milk', 'Side shot of cold or steamed whole milk.'),
(104, 'ar', 'لبن', 'لبن'),
(105, 'en', 'Ice Cream Scoop', 'Scoop of premium vanilla ice cream.'),
(105, 'ar', 'بولة آيس كريم', 'بولة آيس كريم'),
(106, 'en', 'Extra Sauce', 'Drizzle of caramel, chocolate, or Lotus sauce.'),
(106, 'ar', 'صوص', 'صوص'),
(107, 'en', 'Extra Nuts', 'Toasted crushed almonds and hazelnut topping.'),
(107, 'ar', 'مكسرات', 'مكسرات'),
(108, 'en', 'Lotus Biscoff Milkshake', 'Biscoff cookie spread blended into thick milkshake.'),
(108, 'ar', 'لوتس', 'لوتس'),
(109, 'en', 'Pancakes 12 Pcs', '12 mini fluffy pancakes with your choice of topping.'),
(109, 'ar', 'بان كيك 12 قطعة', 'بان كيك 12 قطعة'),
(110, 'en', 'Pancakes 6 Pcs', '6 mini fluffy pancakes served with syrup.'),
(110, 'ar', 'بان كيك 6 قطع', 'بان كيك 6 قطع'),
(111, 'en', 'Pancakes 25 Pcs', '25 mini fluffy pancakes tower for sharing.'),
(111, 'ar', 'بان كيك 25 قطعة', 'بان كيك 25 قطعة'),
(112, 'en', 'Banana Waffle', 'Crispy waffle topped with sliced fresh banana and syrup.'),
(112, 'ar', 'موز', 'موز'),
(113, 'en', 'Fruit Waffle', 'Waffle garnished with fresh seasonal fruit selection.'),
(113, 'ar', 'فواكه', 'فواكه'),
(114, 'en', 'Ice Cream Waffle (4 Flavors)', 'Waffle loaded with 4 scoops of different ice creams.'),
(114, 'ar', 'ايس كريم (4 أنواع)', 'ايس كريم (4 أنواع)'),
(115, 'en', 'Hamid Special Waffle', 'Signature waffle with 4 fillings & 4 dessert sauces.'),
(115, 'ar', 'حميد (4 حشوات + 4 صوص)', 'حميد (4 حشوات + 4 صوص)'),
(116, 'en', 'Lotus Biscoff Milkshake', 'Biscoff cookie spread blended into thick milkshake.'),
(116, 'ar', 'لوتس', 'لوتس'),
(117, 'en', 'White Chocolate Waffle', 'Belgian waffle topped with melted white chocolate.'),
(117, 'ar', 'وايت شوكليت', 'وايت شوكليت'),
(118, 'en', 'Nutella Milkshake', 'Authentic Nutella hazelnut cocoa cream shake.'),
(118, 'ar', 'نوتيلا', 'نوتيلا'),
(119, 'en', 'Oreo Milkshake', 'Crushed Oreo cookies blended with vanilla ice cream.'),
(119, 'ar', 'اوريو', 'اوريو');
INSERT INTO `menu_item_sizes` (`item_id`, `size`, `price`, `sort_order`) VALUES
(1, 'Regular', '50.00', 0),
(2, 'Single', '45.00', 0),
(2, 'Double', '55.00', 1),
(3, 'Regular', '55.00', 0),
(4, 'Regular', '60.00', 0),
(5, 'Double', '45.00', 0),
(5, 'Single', '35.00', 1),
(6, 'Large', '60.00', 0),
(6, 'Small', '50.00', 1),
(7, 'Regular', '40.00', 0),
(8, 'Regular', '50.00', 0),
(9, 'Regular', '50.00', 0),
(10, 'Regular', '50.00', 0),
(11, 'Regular', '30.00', 0),
(12, 'Regular', '45.00', 0),
(13, 'Regular', '40.00', 0),
(14, 'Regular', '35.00', 0),
(15, 'Regular', '35.00', 0),
(16, 'Regular', '20.00', 0),
(17, 'Regular', '35.00', 0),
(18, 'Regular', '35.00', 0),
(19, 'Regular', '35.00', 0),
(20, 'Regular', '20.00', 0),
(21, 'Regular', '20.00', 0),
(22, 'Regular', '20.00', 0),
(23, 'Regular', '25.00', 0),
(24, 'Large', '45.00', 0),
(24, 'Small', '40.00', 1),
(25, 'Small', '25.00', 0),
(25, 'Large', '30.00', 1),
(26, 'Large', '40.00', 0),
(26, 'Small', '35.00', 1),
(27, 'Large', '50.00', 0),
(27, 'Small', '40.00', 1),
(28, 'Large', '30.00', 0),
(28, 'Small', '25.00', 1),
(29, 'Small', '45.00', 0),
(29, 'Large', '50.00', 1),
(30, 'Regular', '60.00', 0),
(31, 'Regular', '60.00', 0),
(32, 'Regular', '65.00', 0),
(33, 'Regular', '60.00', 0),
(34, 'Regular', '65.00', 0),
(35, 'Regular', '75.00', 0),
(36, 'Regular', '65.00', 0),
(37, 'Regular', '75.00', 0),
(38, 'Regular', '50.00', 0),
(39, 'Regular', '50.00', 0),
(40, 'Regular', '50.00', 0),
(41, 'Regular', '45.00', 0),
(42, 'Regular', '50.00', 0),
(43, 'Regular', '50.00', 0),
(44, 'Regular', '40.00', 0),
(45, 'Regular', '60.00', 0),
(46, 'Regular', '60.00', 0),
(47, 'Regular', '60.00', 0),
(48, 'Regular', '60.00', 0),
(49, 'Regular', '50.00', 0),
(50, 'Regular', '50.00', 0),
(51, 'Regular', '35.00', 0),
(52, 'Regular', '35.00', 0),
(53, 'Regular', '35.00', 0),
(54, 'Regular', '50.00', 0),
(55, 'Regular', '60.00', 0),
(56, 'Regular', '90.00', 0),
(57, 'Regular', '75.00', 0),
(58, 'Regular', '100.00', 0),
(59, 'Regular', '75.00', 0),
(60, 'Regular', '75.00', 0),
(61, 'Regular', '75.00', 0),
(62, 'Regular', '90.00', 0),
(63, 'Regular', '90.00', 0),
(64, 'Regular', '100.00', 0),
(65, 'Regular', '55.00', 0),
(66, 'Regular', '110.00', 0),
(67, 'Regular', '60.00', 0),
(68, 'Regular', '55.00', 0),
(69, 'Regular', '65.00', 0),
(70, 'Regular', '65.00', 0),
(71, 'Regular', '60.00', 0),
(72, 'Regular', '60.00', 0),
(73, 'Regular', '60.00', 0),
(74, 'Regular', '60.00', 0),
(75, 'Regular', '60.00', 0),
(76, 'Regular', '60.00', 0),
(77, 'Regular', '70.00', 0),
(78, 'Regular', '70.00', 0),
(79, 'Regular', '70.00', 0),
(80, 'Regular', '80.00', 0),
(81, 'Regular', '75.00', 0),
(82, 'Regular', '65.00', 0),
(83, 'Regular', '65.00', 0),
(84, 'Regular', '65.00', 0),
(85, 'Regular', '65.00', 0),
(86, 'Regular', '45.00', 0),
(87, 'Regular', '50.00', 0),
(88, 'Regular', '60.00', 0),
(89, 'Regular', '60.00', 0),
(90, 'Regular', '60.00', 0),
(91, 'Regular', '60.00', 0),
(92, 'Regular', '60.00', 0),
(93, 'Regular', '60.00', 0),
(94, 'Regular', '60.00', 0),
(95, 'Regular', '60.00', 0),
(96, 'Regular', '60.00', 0),
(97, 'Regular', '35.00', 0),
(98, 'Regular', '75.00', 0),
(99, 'Regular', '10.00', 0),
(100, 'Regular', '35.00', 0),
(101, 'Regular', '30.00', 0),
(102, 'Regular', '30.00', 0),
(103, 'Regular', '30.00', 0),
(104, 'Regular', '10.00', 0),
(105, 'Regular', '15.00', 0),
(106, 'Regular', '10.00', 0),
(107, 'Regular', '15.00', 0),
(108, 'Regular', '15.00', 0),
(109, 'Regular', '55.00', 0),
(110, 'Regular', '30.00', 0),
(111, 'Regular', '100.00', 0),
(112, 'Regular', '80.00', 0),
(113, 'Regular', '100.00', 0),
(114, 'Regular', '85.00', 0),
(115, 'Regular', '120.00', 0),
(116, 'Regular', '80.00', 0),
(117, 'Regular', '75.00', 0),
(118, 'Regular', '65.00', 0),
(119, 'Regular', '80.00', 0);

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

