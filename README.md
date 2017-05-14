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