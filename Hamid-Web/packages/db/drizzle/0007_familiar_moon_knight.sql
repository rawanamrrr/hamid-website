ALTER TABLE `menu_hero_images` ADD `mobile_media_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `store_hero_images` ADD `mobile_media_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `banners` ADD `mobile_media_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `menu_hero_images` ADD CONSTRAINT `menu_hero_images_mobile_media_id_media_id_fk` FOREIGN KEY (`mobile_media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `store_hero_images` ADD CONSTRAINT `store_hero_images_mobile_media_id_media_id_fk` FOREIGN KEY (`mobile_media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `banners` ADD CONSTRAINT `banners_mobile_media_id_media_id_fk` FOREIGN KEY (`mobile_media_id`) REFERENCES `media`(`id`) ON DELETE no action ON UPDATE no action;