var libs = process.cwd() + '/libs/';
var config = require(libs + 'config');
var validator = require('validator');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.get('mongodb:uri'), function(err, db) {

	db.collection('data').drop();
	db.collection('status').drop();
	//for (var i=0; i < 5000; i++){
		var data = getData();
		db.collection('data').insert(data);
	//}
	db.collection('status').insert(status);
	db.collection('data').ensureIndex({sid: 1});
	db.collection('status').ensureIndex({sid: 1});
});

function getData(){

	var data = [
		{
			sid: "777",
			type: "order",
			title: "Алексей Карташев",
			text: "Дорога возникает под шагами идущего.",
			date: validator.toDate("2016-04-20 14:48"),
			new: true,
			important: false,
			status: "1"
		},
		{
			sid: "777",
			type: "chat",
			title: "Сергей Чернов",
			text: "Дорога возникает под шагами идущего.",
			date: validator.toDate("2016-04-19 15:42"),
			new: true,
			important: false,
			status: "1"
		},
		{
			sid: "777",
			type: "callback",
			title: "Артем Иванов",
			text: "89160172086",
			date: validator.toDate("2016-04-18 16:14"),
			new: true,
			important: false,
			alarm: true,
			status: "2"
		},
		{
			sid: "777",
			type: "feedback",
			title: "Ирина Юртаева",
			text: "Дорога возникает под шагами идущего.",
			date: validator.toDate("2016-04-06 11:22"),
			new: false,
			important: false,
			status: "6"
		},
		{
			sid: "777",
			type: "profile",
			image: "http://cs630427.vk.me/v630427566/1ba9/9DN9yzy3ZlU.jpg",
			title: "Анастасия Игнатенко",
			text: "Санкт-Петербург",
			date: validator.toDate("2016-04-07 12:18"),
			new: false,
			important: false,
			status: "3"
		},
		{
			sid: "777",
			type: "profile",
			image: "http://cs629231.vk.me/v629231001/c535/Aolq7Qohi2o.jpg",
			title: "Павел Дуров",
			text: "Москва",
			date: validator.toDate("2016-04-08 19:07"),
			new: false,
			important: false,
			status: "1"
		}
	];

	return data;
};

var status = [
	{
		_id: "1",
		sid: "777",
		title: "Без статуса",
		color: "blank"
	},
	{
		_id: "2",
		sid: "777",
		title: "В работе",
		color: "orange"
	},
	{
		_id: "3",
		sid: "777",
		title: "Думает",
		color: "azure"
	},
	{
		_id: "4",
		sid: "777",
		title: "Доставлен",
		color: "violet"
	},
	{
		_id: "5",
		sid: "777",
		title: "Отказались",
		color: "red"
	},
	{
		_id: "6",
		sid: "777",
		title: "Оплачен",
		color: "green"
	}
];