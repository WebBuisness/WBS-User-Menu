-- Döner House seed data
-- Paste this into Supabase SQL editor AFTER running the schema.
-- NOTE: These INSERTs bypass RLS because they run as postgres superuser in the SQL editor.

-- Settings (update WhatsApp number to your real number!)
insert into settings(key,value) values ('whatsapp_number','961XXXXXXXX') on conflict (key) do nothing;
insert into settings(key,value) values ('restaurant_open','true') on conflict (key) do nothing;

-- Categories
with c as (
  insert into categories (name_en, name_ar, sort_order, active) values
    ('Döner','دونر',1,true),
    ('Burger','برجر',2,true),
    ('Hot Dog','هوت دوغ',3,true),
    ('Fries','بطاطا',4,true),
    ('Drinks','مشروبات',5,true)
  returning id, name_en
)
select * from c;

-- Items (use category_id lookups)
insert into items (category_id, name_en, name_ar, desc_en, desc_ar, price, image_url, rating, rating_count, available, has_combo, combo_price, combo_desc_en, combo_desc_ar) values
  ((select id from categories where name_en='Döner'), 'Classic Döner','دونر كلاسيك','Tender marinated beef, crisp veggies, garlic sauce in warm flatbread.','لحم بقري متبل طري مع خضار طازجة وصلصة الثوم في خبز دافئ.',8.5,'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?crop=entropy&cs=srgb&fm=jpg&w=800&q=85',4.8,124,true,true,11.2,'Fries + soft drink','بطاطا + مشروب'),
  ((select id from categories where name_en='Döner'), 'Spicy Chicken Döner','دونر دجاج حار','Grilled chicken with our signature spicy harissa and pickled onions.','دجاج مشوي مع صلصة الهريسة الحارة وبصل مخلل.',7.9,'https://images.unsplash.com/photo-1638537125835-82acb38d3531?crop=entropy&cs=srgb&fm=jpg&w=800&q=85',4.7,98,true,true,10.6,'Fries + soft drink','بطاطا + مشروب'),
  ((select id from categories where name_en='Döner'), 'Beef Döner Wrap','لفافة دونر لحم','Seasoned beef, tomato, lettuce, tahini & sumac in a toasted wrap.','لحم بقري متبل مع طماطم، خس، طحينة وسماق في لفافة محمصة.',9.2,'https://images.unsplash.com/photo-1699728088614-7d1d4277414b?crop=entropy&cs=srgb&fm=jpg&w=800&q=85',4.9,212,true,true,11.9,'Fries + soft drink','بطاطا + مشروب'),
  ((select id from categories where name_en='Döner'), 'XL Döner Plate','طبق دونر كبير','Double-stacked döner with saffron rice and grilled vegetables.','دونر مضاعف مع أرز بالزعفران وخضار مشوية.',13.5,'https://images.unsplash.com/photo-1583060095186-852adde6b819?crop=entropy&cs=srgb&fm=jpg&w=800&q=85',4.9,156,false,false,null,null,null),
  ((select id from categories where name_en='Burger'), 'Signature Cheeseburger','برجر الجبنة','Juicy Angus beef, aged cheddar, caramelized onions, smoked aioli.','لحم أنجوس عصيري، جبنة شيدر، بصل مكرمل، صلصة أيولي مدخنة.',10.5,'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=800',4.8,189,true,true,13.2,'Fries + soft drink','بطاطا + مشروب'),
  ((select id from categories where name_en='Fries'), 'Golden Fries','بطاطا ذهبية','Hand-cut, double-fried to crispy golden perfection. Sea salt.','بطاطا مقطعة يدوياً، مقلية مرتين حتى الذهبي. ملح البحر.',4.5,'https://images.pexels.com/photos/2282528/pexels-photo-2282528.jpeg?auto=compress&cs=tinysrgb&w=800',4.6,87,true,false,null,null,null),
  ((select id from categories where name_en='Hot Dog'), 'Chili Hot Dog','هوت دوغ بالتشيلي','All-beef frank topped with homemade chili, cheese & jalapeños.','نقانق لحم بقري مع تشيلي محلي، جبنة وفلفل هالبينو.',6.9,'https://images.unsplash.com/photo-1613482084286-41f25b486fa2?crop=entropy&cs=srgb&fm=jpg&w=800&q=85',4.7,102,true,true,9.6,'Fries + soft drink','بطاطا + مشروب'),
  ((select id from categories where name_en='Hot Dog'), 'Classic NY Dog','هوت دوغ نيويورك','Steamed bun, grilled frank, yellow mustard & sauerkraut.','خبز مبخر، نقانق مشوية، خردل أصفر ومخلل الملفوف.',5.9,'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?crop=entropy&cs=srgb&fm=jpg&w=800&q=85',4.5,76,true,true,8.6,'Fries + soft drink','بطاطا + مشروب'),
  ((select id from categories where name_en='Hot Dog'), 'Loaded Cheese Dog','هوت دوغ بالجبنة','Melted cheddar, crispy bacon bits, chives & honey mustard.','جبنة شيدر ذائبة، قطع بيكون مقرمشة، ثوم معمر وخردل بالعسل.',7.5,'https://images.pexels.com/photos/12123657/pexels-photo-12123657.jpeg?auto=compress&cs=tinysrgb&w=800',4.8,134,true,true,10.2,'Fries + soft drink','بطاطا + مشروب'),
  ((select id from categories where name_en='Hot Dog'), 'Smokehouse Dog','هوت دوغ مدخن','Smoked sausage, crispy onions, BBQ sauce on a brioche bun.','سجق مدخن، بصل مقرمش، صلصة باربكيو على خبز بريوش.',8.2,'https://images.pexels.com/photos/28087251/pexels-photo-28087251.jpeg?auto=compress&cs=tinysrgb&w=800',4.9,167,true,true,10.9,'Fries + soft drink','بطاطا + مشروب'),
  ((select id from categories where name_en='Drinks'), 'Craft Cola','كولا','Ice-cold craft cola, served in a glass bottle.','كولا باردة في زجاجة.',2.5,'https://images.unsplash.com/photo-1735643434124-f51889fa1f8c?crop=entropy&cs=srgb&fm=jpg&w=800&q=85',4.4,52,true,false,null,null,null),
  ((select id from categories where name_en='Drinks'), 'Orange Fizz','عصير برتقال فوار','Sparkling orange soda with real fruit juice. Refreshing.','صودا برتقال فوارة بعصير الفاكهة الحقيقي. منعشة.',2.8,'https://images.pexels.com/photos/33450363/pexels-photo-33450363.jpeg?auto=compress&cs=tinysrgb&w=800',4.5,41,true,false,null,null,null);

-- Promo codes
insert into promo_codes (code, discount_type, value, active, usage_limit, used_count) values
  ('WELCOME10','percent',10,true,1000,0),
  ('SAVE5','fixed',5,true,500,0)
on conflict (code) do nothing;
