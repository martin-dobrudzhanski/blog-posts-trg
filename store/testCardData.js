export const state = () => {
  return {
    title: 'Blog Title',
    description:
      'Lorem ipsum Lorem ipsum Lorem ipsumLorem ipsum ipsumLoremipsumLorem '
  };
};

export const getters = {
  getTitle(state) {
    return state.title;
  },
  getDescription(state) {
    return state.description;
  }
};

export const actions = {};

export const mutations = {};
