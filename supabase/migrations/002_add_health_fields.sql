-- 为pets表添加缺失的健康状态字段
-- 执行此SQL前请确保已备份数据库

-- 检查字段是否已存在，如果不存在则添加
DO $$
BEGIN
    -- 检查vaccine_status字段是否存在
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pets' AND column_name = 'vaccine_status'
    ) THEN
        ALTER TABLE pets ADD COLUMN vaccine_status BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '已添加 vaccine_status 字段';
    ELSE
        RAISE NOTICE 'vaccine_status 字段已存在';
    END IF;

    -- 检查dewormed字段是否存在
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pets' AND column_name = 'dewormed'
    ) THEN
        ALTER TABLE pets ADD COLUMN dewormed BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '已添加 dewormed 字段';
    ELSE
        RAISE NOTICE 'dewormed 字段已存在';
    END IF;

    -- 检查sterilized字段是否存在
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pets' AND column_name = 'sterilized'
    ) THEN
        ALTER TABLE pets ADD COLUMN sterilized BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '已添加 sterilized 字段';
    ELSE
        RAISE NOTICE 'sterilized 字段已存在';
    END IF;
END $$;

-- 验证字段是否添加成功
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'pets'
AND column_name IN ('vaccine_status', 'dewormed', 'sterilized')
ORDER BY column_name;
