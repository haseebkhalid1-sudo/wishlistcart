-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "WishlistType" AS ENUM ('PERSONAL', 'REGISTRY', 'COLLABORATIVE');

-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('PRIVATE', 'SHARED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'BABY_SHOWER', 'BIRTHDAY', 'HOLIDAY', 'HOUSEWARMING', 'GRADUATION', 'ANNIVERSARY', 'BACK_TO_SCHOOL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('ANY_DROP', 'TARGET_PRICE', 'PERCENTAGE_DROP');

-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "stripe_customer_id" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "WishlistType" NOT NULL DEFAULT 'PERSONAL',
    "cover_image" TEXT,
    "privacy" "Privacy" NOT NULL DEFAULT 'PRIVATE',
    "share_token" TEXT,
    "share_password" TEXT,
    "event_type" "EventType",
    "event_date" TIMESTAMP(3),
    "event_location" TEXT,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" UUID NOT NULL,
    "wishlist_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "affiliate_url" TEXT,
    "store_name" TEXT,
    "store_domain" TEXT,
    "image_url" TEXT,
    "price" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "original_price" DECIMAL(10,2),
    "priority" INTEGER NOT NULL DEFAULT 3,
    "position" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_purchased" BOOLEAN NOT NULL DEFAULT false,
    "purchased_by" UUID,
    "purchased_at" TIMESTAMP(3),
    "gift_message" TEXT,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_alerts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "target_price" DECIMAL(10,2),
    "percentage_drop" INTEGER,
    "alert_type" "AlertType" NOT NULL DEFAULT 'ANY_DROP',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_triggered" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_gift_pools" (
    "id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "organizer_id" UUID NOT NULL,
    "goal_amount" DECIMAL(10,2) NOT NULL,
    "current_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "status" "PoolStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_gift_pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_gift_contributions" (
    "id" UUID NOT NULL,
    "pool_id" UUID NOT NULL,
    "contributor_id" UUID,
    "contributor_name" TEXT NOT NULL,
    "contributor_email" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "message" TEXT,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "stripe_charge_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_gift_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_funds" (
    "id" UUID NOT NULL,
    "wishlist_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "goal_amount" DECIMAL(10,2),
    "current_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_funds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occasion_reminders" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "person_name" TEXT NOT NULL,
    "occasion_type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT true,
    "reminder_days_before" INTEGER NOT NULL DEFAULT 14,
    "linked_wishlist_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "occasion_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "follower_id" UUID NOT NULL,
    "following_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id","following_id")
);

-- CreateTable
CREATE TABLE "affiliate_clicks" (
    "id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "user_id" UUID,
    "affiliate_network" TEXT NOT NULL,
    "retailer" TEXT NOT NULL,
    "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "commission_amount" DECIMAL(10,2),
    "order_id" TEXT,

    CONSTRAINT "affiliate_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "read_at" TIMESTAMP(3),
    "sent_via" TEXT NOT NULL DEFAULT 'in_app',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_share_token_key" ON "wishlists"("share_token");

-- CreateIndex
CREATE INDEX "wishlists_user_id_idx" ON "wishlists"("user_id");

-- CreateIndex
CREATE INDEX "wishlists_share_token_idx" ON "wishlists"("share_token");

-- CreateIndex
CREATE INDEX "wishlists_privacy_idx" ON "wishlists"("privacy");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_user_id_slug_key" ON "wishlists"("user_id", "slug");

-- CreateIndex
CREATE INDEX "wishlist_items_wishlist_id_idx" ON "wishlist_items"("wishlist_id");

-- CreateIndex
CREATE INDEX "wishlist_items_user_id_idx" ON "wishlist_items"("user_id");

-- CreateIndex
CREATE INDEX "wishlist_items_store_domain_idx" ON "wishlist_items"("store_domain");

-- CreateIndex
CREATE INDEX "price_history_item_id_checked_at_idx" ON "price_history"("item_id", "checked_at");

-- CreateIndex
CREATE UNIQUE INDEX "price_alerts_user_id_item_id_key" ON "price_alerts"("user_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_gift_pools_item_id_key" ON "group_gift_pools"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "cash_funds_wishlist_id_key" ON "cash_funds"("wishlist_id");

-- CreateIndex
CREATE INDEX "affiliate_clicks_item_id_idx" ON "affiliate_clicks"("item_id");

-- CreateIndex
CREATE INDEX "affiliate_clicks_clicked_at_idx" ON "affiliate_clicks"("clicked_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "wishlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_purchased_by_fkey" FOREIGN KEY ("purchased_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "wishlist_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "wishlist_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_gift_pools" ADD CONSTRAINT "group_gift_pools_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "wishlist_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_gift_contributions" ADD CONSTRAINT "group_gift_contributions_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "group_gift_pools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_gift_contributions" ADD CONSTRAINT "group_gift_contributions_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_funds" ADD CONSTRAINT "cash_funds_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "wishlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occasion_reminders" ADD CONSTRAINT "occasion_reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "affiliate_clicks_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "wishlist_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "affiliate_clicks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

