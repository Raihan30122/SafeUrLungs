import React from 'react';
import {StyleSheet, Text, View, SectionList, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const DATA = [
  {
    title: 'Kelas A',
    icon: 'group',
    data: ['Raihan Jofaldi', 'Nanda Putra', 'Faisal Rahman', 'Aisyah Zahra'],
  },
  {
    title: 'Kelas B',
    icon: 'group',
    data: ['Bagus Pratama', 'Lia Wulandari', 'Reza Arifin', 'Nabila Salsabila'],
  },
  {
    title: 'Asisten',
    icon: 'people-outline',
    data: [
      'Rini Husadiyah',
      'M. Syaiful',
      'Hayyu Rahmayani Puspitasari',
      'Veronica Tia Ningrum',
    ],
  },
  {
    title: 'Dosen',
    icon: 'school',
    data: ['Prof. Dr. Muhammad Anshori S.Si., M.Sc'],
  },
];

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, section}) => (
          <View style={styles.item}>
            <View style={styles.row}>
              <MaterialIcons
                name={
                  (section.icon === 'school'
                    ? 'person-pin'
                    : 'person') as any
                }
                size={22}
                color="#2a4d69"
              />
              <Text style={styles.title}>{item}</Text>
            </View>
          </View>
        )}
        renderSectionHeader={({section: {title, icon}}) => (
          <View style={styles.headerContainer}>
            <View style={styles.row}>
              <MaterialIcons
                name={(icon === 'people-outline' ? 'people' : icon) as any}
                size={22}
                color="#fff"
              />
              <Text style={styles.header}>{title}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
    backgroundColor: '#f5f7fb',
  },
  headerContainer: {
    backgroundColor: '#2a4d69',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.6,
    marginLeft: 6,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 14,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d3d9e3',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    color: '#2a4d69',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default App;
