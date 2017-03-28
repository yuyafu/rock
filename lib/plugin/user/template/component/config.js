export default{
  props: {
    apiProp: {
      mtopProp: {
        mockJS: process.env.NODE_ENV === 'development' ? require('mockjs') : null
      }
      // ,fetchProp:{
      //   mockJS: process.env.NODE_ENV === 'development' ? require('mockjs') : null
      // }
    }
  },
  id: 'container'
};
