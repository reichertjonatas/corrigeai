
import { ISubscription } from '../../../models/User';

export const checkUserLevel = async (email: string) : Promise<number> => {
    try {
        // const user = await User.findOne({ email: email });
        // if(user.userType == null) 
        //     throw new Error("User not found!");

        return 0;
    } catch (error) {
        return 0;
    }
}

export const userSubscription = async (email: string) : Promise<ISubscription> => {
    // try {
    //     const user = await User.findOne({ email: email });
    //     return user.subscription;
    // } catch (error) {

        // @ts-ignore
        return {
            envios: 0,
            subscriptionName: 'Grátis',
            subscriptionType: 0,
            subscriptionDate: null,
            subscriptionExpr: null,
        };
    
}