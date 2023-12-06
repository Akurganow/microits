import dayjs from 'dayjs'
import { NewTaskValues } from 'types/tasks'

export type HintFields = NewTaskValues
export type Localized<T> = {
	ru: T
	en: T
	fr: T
	es: T
}

export type Hint = {
	images: string[]
	text: Localized<string>
	button: Localized<string>
	fields: Localized<HintFields>
}

const hints: Hint[] = [
	{
		images: [
			'/images/empty-hints/0-0.png',
			'/images/empty-hints/0-1.png',
			'/images/empty-hints/0-2.png',
			'/images/empty-hints/0-3.png',
		],
		text: {
			ru: 'Alexenda поможет тебе организовать учебу и найти время для увлечений',
			en: 'Alexenda will help you organize your studies and find time for your hobbies',
			fr: 'Alexenda vous aidera à organiser vos études et à trouver du temps pour vos loisirs',
			es: 'Alexenda te ayudará a organizar tus estudios y a encontrar tiempo para tus aficiones',
		},
		button: {
			ru: 'Запланируй учебу',
			en: 'Plan your studies',
			fr: 'Planifiez vos études',
			es: 'Planifica tus estudios',
		},
		fields: {
			en: {
				title: 'Study and personal time',
				description: 'Homework first, then games',
				estimate: 3,
				date: dayjs().toString(),
				dueDate: dayjs().toString(),
				tags: ['Study', 'Personal'],
				checkList: ['History','Math','Game party']
			},
			fr: {
				title: 'Étude et temps personnel',
				description: 'Devoirs d’abord, puis jeux',
				estimate: 3,
				date: dayjs().toString(),
				dueDate: dayjs().toString(),
				tags: ['Étude', 'Personnel'],
				checkList: ['Histoire', 'Math', 'Fête de jeux']
			},
			es: {
				title: 'Estudio y tiempo personal',
				description: 'Tarea primero, luego juegos',
				estimate: 3,
				date: dayjs().toString(),
				dueDate: dayjs().toString(),
				tags: ['Estudio', 'Personal'],
				checkList: ['Historia', 'Matemáticas', 'Fiesta de juegos']
			},
			ru: {
				title: 'Учеба и личное время',
				description: 'Сначала домашка, потом игры',
				estimate: 3,
				date: dayjs().toString(),
				dueDate: dayjs().toString(),
				tags: ['Учеба', 'Личное'],
				checkList: ['История', 'Математика', 'Гейм-пати']
			}
		}
	},
	{
		images: [
			'/images/empty-hints/1-0.png',
			'/images/empty-hints/1-1.png',
			'/images/empty-hints/1-2.png',
			'/images/empty-hints/1-3.png',
		],
		text: {
			ru: 'С Alexenda ваша кулинарная жизнь станет проще и организованнее',
			en: 'With Alexenda, your culinary life will become easier and more organized',
			fr: 'Avec Alexenda, votre vie culinaire sera plus facile et mieux organisée',
			es: 'Con Alexenda, tu vida culinaria será más fácil y organizada',
		},
		button: {
			ru: 'Запланируй меню на неделю',
			en: 'Plan your weekly menu',
			fr: 'Planifiez votre menu hebdomadaire',
			es: 'Planifica tu menú semanal',
		},
		fields: {
			ru: {
				title: 'Меню на неделю',
				description: `- Понедельник - борщ, котлеты с пюре, овощной салат
- Вторник - рассольник, пюре с котлетами, греческий салат
- Среда - уха, паста с томатным соусом, салат с грибами
- Четверг - щи, котлеты с пюре, овощной салат
- Пятница - суп с фрикадельками, жареная картошка, салат с крабовыми палочками
- Суббота - солянка, пюре с котлетами, овощной салат
- Воскресенье - борщ, паста с томатным соусом, овощной салат`,
				estimate: 3,
				date: dayjs().add(1, 'day').toString(),
				dueDate: dayjs().startOf('week').add(1, 'week').toString(),
				tags: ['Еда', 'Личное'],
				checkList: ['Список продуктов', 'Заказ продуктов', 'Заготовки']
			},
			fr: {
				title: 'Menu de la semaine',
				description: `- Lundi - Ratatouille, Poulet rôti avec purée de pommes de terre, Salade niçoise
- Mardi - Coq au Vin, Gratin de pommes de terre, Salade de chèvre chaud
- Mercredi - Bouillabaisse, Quiche Lorraine, Salade aux champignons
- Jeudi - Confit de canard, Gratin dauphinois, Salade de légumes provençale
- Vendredi - Soupe à l'oignon, Quiche aux fruits de mer, Salade verte
- Samedi - Boeuf Bourguignon, Gratin de courgettes, Salade de haricots verts
- Dimanche - Pot-au-Feu, Quenelles de brochet, Salade de ratte du Touquet`,
				estimate: 3,
				date: dayjs().add(1, 'day').toString(),
				dueDate: dayjs().startOf('week').add(1, 'week').toString(),
				tags: ['Nourriture', 'Personnel'],
				checkList: ['Liste des produits', 'Commande de produits', 'Stocks']
			},
			es: {
				title: 'Menú semanal',
				description: `- Lunes - Gazpacho, Albóndigas con puré de patatas, Ensalada de verduras
- Martes - Paella, Tortilla española, Ensalada griega
- Miércoles - Sopa de pescado, Pasta con salsa de tomate, Ensalada de champiñones
- Jueves - Cocido madrileño, Albóndigas con puré de patatas, Ensalada de verduras
- Viernes - Sopa de albóndigas, Patatas bravas, Ensalada de cangrejo
- Sábado - Fabada asturiana, Albóndigas con puré de patatas, Ensalada de verduras
- Domingo - Gazpacho, Pasta con salsa de tomate, Ensalada de verduras`,
				estimate: 3,
				date: dayjs().add(1, 'day').toString(),
				dueDate: dayjs().startOf('week').add(1, 'week').toString(),
				tags: ['Comida', 'Personal'],
				checkList: ['Lista de productos', 'Pedido de productos', 'Conservas']
			},
			en: {
				title: 'Weekly menu',
				description: `- Monday - Cheeseburger with French fries, Coleslaw
- Tuesday - Macaroni and Cheese, Chicken Tenders with Ranch Dressing, Caesar Salad
- Wednesday - Clam Chowder, Spaghetti with Meatballs, Garden Salad
- Thursday - BBQ Pulled Pork Sandwiches with Corn on the Cob, Potato Salad
- Friday - New England Clam Chowder, Fish and Chips, Coleslaw
- Saturday - Chili with Cornbread, Chicken Fried Steak with Mashed Potatoes, Corn Salad
- Sunday - Chicken Noodle Soup, Meatloaf with Gravy and Mashed Potatoes, Green Bean Casserole`,
				estimate: 3,
				date: dayjs().add(1, 'day').toString(),
				dueDate: dayjs().startOf('week').add(1, 'week').toString(),
				tags: ['Food', 'Personal'],
				checkList: ['List of products', 'Product order', 'Stocks']
			}
		}
	},
	{
		images: [
			'/images/empty-hints/2-0.png',
			'/images/empty-hints/2-1.png',
			'/images/empty-hints/2-2.png',
			'/images/empty-hints/2-3.png',
		],
		text: {
			ru: 'Alexenda поможет тебе организовать идеальное утро для продуктивного дня',
			en: 'Alexenda will help you organize the perfect morning for a productive day',
			fr: 'Alexenda vous aidera à organiser le matin parfait pour une journée productive',
			es: 'Alexenda te ayudará a organizar la mañana perfecta para un día productivo',
		},
		button: {
			ru: 'Запланируй идеальное утро',
			en: 'Plan your perfect morning',
			fr: 'Planifiez votre matinée parfaite',
			es: 'Planifica tu mañana perfecta',
		},
		fields: {
			ru: {
				title: 'Утренний план',
				description: 'Утренняя рутина для хорошего начала дня',
				estimate: 1,
				date: dayjs().add(1, 'day').toString(),
				dueDate: dayjs().add(1, 'day').toString(),
				tags: ['Личное', 'Рутина'],
				checkList: ['Медитация', 'Завтрак', 'План на день']
			},
			fr: {
				title: 'Plan du matin',
				description: 'Routine du matin pour bien commencer la journée',
				estimate: 1,
				date: dayjs().add(1, 'day').toString(),
				dueDate: dayjs().add(1, 'day').toString(),
				tags: ['Personnel', 'Routine'],
				checkList: ['Méditation', 'Petit déjeuner', 'Plan de la journée']
			},
			es: {
				title: 'Plan de la mañana',
				description: 'Rutina de la mañana para empezar bien el día',
				estimate: 1,
				date: dayjs().add(1, 'day').toString(),
				dueDate: dayjs().add(1, 'day').toString(),
				tags: ['Personal', 'Rutina'],
				checkList: ['Meditación', 'Desayuno', 'Plan del día']
			},
			en: {
				title: 'Morning plan',
				description: 'Morning routine for a good start to the day',
				estimate: 1,
				date: dayjs().add(1, 'day').toString(),
				dueDate: dayjs().add(1, 'day').toString(),
				tags: ['Personal', 'Routine'],
				checkList: ['Meditation', 'Breakfast', 'Plan for the day']
			}
		}
	}
]

export default hints