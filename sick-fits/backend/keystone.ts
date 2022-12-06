import { createAuth } from '@keystone-next/auth';
import {config, createSchema } from '@keystone-next/keystone/schema';
import {withItemData, statelessSessions} from  '@keystone-next/keystone/session'
import { Product } from './schemas/Product';
import { User } from './schemas/User';
import 'dotenv/config'



const databaseUrl = process.env.DATABASE_URL || 'mongodb//localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
maxAge:60 * 60 * 24* 360, // how long they signed in?;
secret:process.env.COOKIE_SECRET,
}

const {withAuth} = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    //TODO: add in inital roles here
  }
})

export default withAuth(
config({
  //@ts-ignore
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseUrl,
  }, //TODO: Add data seeding here
  lists: createSchema({
    //schema items go in here
    User,
    Product,
  }),
  ui: {
    // Show the UI only for peaple who pass this test
    isAccessAllowed:({session}) => {
      // console.log(session);
      return session?.data
    }
  },
  session: withItemData(statelessSessions(sessionConfig), {
    //GraphQL Query   
    User: `id name email`
  })
  //TODO: Add session values here
}))