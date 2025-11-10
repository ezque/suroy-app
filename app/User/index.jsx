import { View, Text } from "react-native"
import Home from '../Tabs/Home';
import Favorites from "../Tabs/Favorites";
import FooterNav from "../Components/FooterNav";

export default function index(){
    return (
        <View>
            <View>

            </View>
            <View style={styles.pagesContainer}>
                <Home />

            </View>
            <View>
                <FooterNav />
            </View>
        </View>
    )
}