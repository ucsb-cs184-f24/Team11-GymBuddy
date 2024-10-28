import { Text, View } from 'react-native';
import Body, { ExtendedBodyPart, Slug } from "react-native-body-highlighter";

export default function Workout() {

  const data: ExtendedBodyPart[] = [
    { slug: "chest" as Slug, intensity: 1 },
    { slug: "abs" as Slug, intensity: 2 },
  ];

  return (
    <View>
      <Body data={data} />
    </View>
  );
}