import { Menu } from './menu.entity';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';
import { Order } from './order.entity';
import { OrderItem } from './order_item.entity';

const entities = [Menu, Restaurant, User, Order, OrderItem];
export { Menu, Restaurant, User, Order, OrderItem };
export default entities;
