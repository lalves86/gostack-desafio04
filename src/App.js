import React, { useState, useEffect } from "react";

import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  function handleLikeRepository(id) {
    api.post(`repositories/${id}/like`);

    const updatedRepository = repositories.map(repository => {
      if (repository.id === id) {
        repository.likes += 1;
      }
      return repository;
    });

    const filteredRepositories = repositories.filter(repository => repository.id !== id);

    setRepositories(updatedRepository);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>
              <FlatList
                style={styles.techsContainer}
                data={repository.techs}
                keyExtractor={tech => tech}
                renderItem={({ item: tech}) => (
                    <Text style={styles.tech}>{tech}</Text>
                )}
              />
              <View style={styles.likesContainer}>
                <Text 
                  testID={`repository-likes-${repository.id}`} 
                  style={styles.likes}
                >
                  {repository.likes} curtida{repository.likes !== 1 && 's'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => handleLikeRepository(repository.id)} 
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
    textAlign: 'center',
  },
});
