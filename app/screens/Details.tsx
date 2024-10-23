import { View, Text } from 'react-native';
import React from 'react';

interface DetailsProps {
    name: string; // Define name prop type
}

const Details: React.FC<DetailsProps> = ({ name }) => {
    return (
        <View>
            <Text>Details for: {name}</Text> 
        </View>
    );
};

export default Details;
