import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const home = () => {
  return (
    <ScrollView>
      <Text>home</Text>
      <TouchableOpacity>
        <Image source={require(`../assets/images/colabottle.png`)} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={require(`../assets/images/colabigcan.png`)} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={require(`../assets/images/colasmallcan.png`)} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image/>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default home;
