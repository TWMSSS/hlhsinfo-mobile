import { StyleSheet, View } from "react-native";
import { Text, Divider, Card } from "react-native-paper";
import { ProgressChart } from "react-native-chart-kit";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getTheme, colorWithOpcy, chartConfig } from "../../util";

chartConfig.backgroundGradientToOpacity = 0;
chartConfig.backgroundGradientFromOpacity = 0;
chartConfig.propsForVerticalLabels = {
    fontSize: "30"
}
export const getChartConfig = () => {
    return chartConfig;
}

const style = StyleSheet.create({
    f: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    d: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
    },
    p: {
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline",
        marginTop: 30
    },
    s: {
        fontWeight: "bold",
        marginLeft: 15
    },
    ss: {
        color: getTheme().colors.outline,
        marginLeft: 5,
        overflow: "hidden"
    }
})

export const M = (prop) => {
    return (
        <View style={style.p}>
            {prop.children}
        </View>
    )
}
export const MdB = (prop) => {
    return (<M>
        <Text variant="displayMedium" style={{
            ...style.s,
            marginLeft: 0
        }} onPress={prop.onPress}>{prop.name}</Text>
        <Text variant="headlineSmall" style={{
            ...style.ss,
            marginLeft: 0
        }}>{prop.desc}</Text>
    </M>)
}
export const MdP = (prop) => {
    return (<M>
        <View style={style.f}>
            <ProgressChart
                data={{
                    data: prop.data
                }}
                height={100}
                width={100}
                strokeWidth={16}
                radius={32}
                chartConfig={chartConfig}
                hideLegend={true}
            />
            <View style={style.d}>
                <Text variant="displayMedium" style={style.s}>{prop.display}</Text>
                <Text style={style.ss}>分</Text>
            </View>
        </View>
        <Text variant="headlineSmall" style={{
            ...style.ss,
            marginLeft: 0
        }}>{prop.desc}</Text>
    </M>)
}
export const MsP = (prop) => {
    return (<>
        <Text variant="headlineSmall" style={{
            margin: 15
        }}>{prop.title}</Text>
        <View style={style.f}>
            {prop.children}
        </View>
    </>)
}
export const MdPT = (prop) => {
    return (<MsP title={prop.title}>
        <ProgressChart
            data={{
                data: prop.data
            }}
            height={100}
            width={100}
            strokeWidth={16}
            radius={32}
            chartConfig={prop.chartConfig ?? chartConfig}
            hideLegend={true}
        />
        <View style={style.d}>
            <Text variant="displayMedium" style={style.s}>{prop.display}</Text>
            <Text style={style.ss}>分</Text>
        </View>
    </MsP>)
}
export const Md = (prop) => {
    return (<M>
        <Text variant="headlineSmall" style={{
            ...style.ss,
            marginLeft: 0
        }}>{prop.title}</Text>
        <View style={style.d}>
            {prop.children}
        </View>
    </M>);
}
export const Mr = (prop) => {
    return (<Md title={prop.title}>
        <Text style={style.ss}>第</Text>
        <Text variant="displayMedium" style={style.s}>{prop.display}</Text>
        <Text style={style.ss}>名</Text>
    </Md>);
}
export const MrP = (prop) => {
    return (<Md title={prop.title}>
        <Text variant="displayMedium" style={style.s}>{prop.display}</Text>
        <Text style={style.ss}>分</Text>
    </Md>);
}
export const ShOption = (prop) => {
    return (<>
        <Card onPress={prop.onPress} style={{
            borderRadius: 0,
            border: 0,
            paddingLeft: 15
        }} elevation={0}>
            <View style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row"
            }}>
                { prop.icon && <MaterialCommunityIcons name={prop.icon} size={30} /> }
                <Text variant="headlineSmall"  style={{
                    padding: 15,
                }}>{prop.text}</Text>
            </View>
        </Card>
        <Divider />
    </>)
}

export const mCCF = (color) => {
    return {
        ...chartConfig,
        color: (opcy = 1) => colorWithOpcy(color, opcy)
    };
}