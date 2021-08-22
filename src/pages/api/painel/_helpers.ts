
import User, { ISubscription } from '../../../models/userTeste';
import dbConnect from '../../../services/mongodb'

export const checkUserLevel = async (email: string) : Promise<number> => {
    await dbConnect();
    try {
        const user = await User.findOne({ email: email });
        if(user.userType == null) 
            throw new Error("User not found!");

        return user.userType as number;
    } catch (error) {
        return 0;
    }
}

export const userSubscription = async (email: string) : Promise<ISubscription> => {
    await dbConnect();
    try {
        const user = await User.findOne({ email: email });
        return user.subscription;
    } catch (error) {

        // @ts-ignore
        return {
            envios: 0,
            subscriptionName: 'Grátis',
            subscriptionType: 0,
            subscriptionDate: null,
            subscriptionExpr: null,
        };
    }
}