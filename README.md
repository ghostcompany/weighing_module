How to make JSON Database Maria DB

CREATE TABLE `jsontest` (
	`id` VARCHAR(32) NOT NULL,
	`doc` BLOB NOT NULL
)
ENGINE=InnoDB
;


INSERT INTO jsontest VALUES 
  (12345678901234567890123456789012, COLUMN_CREATE('color', 'blue', 'size', 'XL'));
  
  
 SELECT id, COLUMN_JSON(doc) as doc FROM jsontest;
 
 http://localhost:8877/?sql=SELECT%20id%20%2C%20CONVERT(COLUMN_JSON(doc)%20USING%20utf8)%20as%20doc%20FROM%20jsontest%20WHERE%20COLUMN_GET(doc%2C%20%27test%27%20as%20char)%3D%27true%27