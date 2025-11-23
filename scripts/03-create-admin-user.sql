-- New script to create admin user correctly with Supabase Auth
-- NEXOVENTIS - Create Admin User
-- Este script crea el usuario administrador inicial
-- IMPORTANTE: Solo ejecutar UNA VEZ después de crear las tablas

-- Este script debe ejecutarse desde el SQL Editor de Supabase Dashboard
-- con los privilegios de service_role

DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Verificar si ya existe el admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@nexoventis.com') THEN
    
    -- Crear usuario en auth.users (Supabase Auth)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@nexoventis.com',
      crypt('admin123', gen_salt('bf')), -- Contraseña: admin123
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Administrador","role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO user_id;

    -- Crear perfil en tabla users (el trigger debería hacer esto automáticamente,
    -- pero lo hacemos manualmente para asegurar que el rol sea admin)
    INSERT INTO public.users (id, email, full_name, role, is_active)
    VALUES (
      user_id,
      'admin@nexoventis.com',
      'Administrador',
      'admin',
      true
    )
    ON CONFLICT (id) DO UPDATE SET role = 'admin';

    RAISE NOTICE 'Usuario administrador creado exitosamente';
    RAISE NOTICE 'Email: admin@nexoventis.com';
    RAISE NOTICE 'Contraseña: admin123';
    RAISE NOTICE 'IMPORTANTE: Cambia la contraseña después del primer inicio de sesión';
    
  ELSE
    RAISE NOTICE 'El usuario administrador ya existe';
  END IF;
END $$;
