import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { omit } from "lodash";
import { Identifier } from "react-admin";

const apiUrl =
  process.env.REACT_APP_API_URL ||
  "https://chanel-api-dev.southpigalle.io/gql/graphql";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const client = new ApolloClient({
  uri: apiUrl,
  headers: { "x-graphql-token": "YYY" },
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

const fields = {
  user: "id email password createdAt clanId",
  boutique: "id name",
  clan: "id name boutiqueId",
  documentByDate: "id date order documentId",
  document: "id name",
  lesson: "id name order documentId quizzId articleId openQuestionId",
  quizz: "id name",
  article: "id title subTitle content image",
  answer: "id name isCorrect quizzId",
  userRole: "id userId roleId",
  role: "id name",
  kpi: "id name target type",
  kpiUser: "id userId kpiId value date",
  kpiBoutique: "id boutiqueId kpiId value date",
  kpiClan: "id clanId kpiId value date",
  userQuizzAnswer: "id userId quizzId answerId",
  openQuestion: "id name",
  userOpenQuestionAnswer: "id userId openQuestionId answer",
};

export const dataProvider = {
  getList: (
    resource: string,
    {
      sort,
      pagination,
      filter,
    }: {
      sort: { field: string; order: string };
      pagination: { page: number; perPage: number };
      filter: any;
    }
  ) => {
    const { field, order } = sort;
    const { page, perPage } = pagination;
    return client
      .query({
        query: gql`
            query ($take: Int, $skip: Int, $order_by: [${capitalizeFirstLetter(
              resource
            )}OrderByWithRelationInput!], $where: ${capitalizeFirstLetter(
          resource
        )}WhereInput!) {
                ${resource}s(take: $take, skip: $skip, orderBy: $order_by, where: $where) {
                    ${fields[resource as keyof typeof fields]}
                }
                ${resource}sCount(where: $where)
            }`,
        variables: {
          take: perPage,
          skip: (page - 1) * perPage,
          order_by: { [field]: order.toLowerCase() },
          where: filter || {},
          // where: Object.keys(filter).reduce(
          //   (prev, key) => ({
          //     ...prev,
          //     [key]: { _eq: filter[key] },
          //   }),
          //   {}
          // ),
        },
      })
      .then((result) => ({
        data: result.data[`${resource}s`],
        total: result.data[`${resource}sCount`],
      }));
  },
  getOne: (resource: string, params: { id: number }) => {
    return client
      .query({
        query: gql`
            query ($where: ${capitalizeFirstLetter(
              resource
            )}WhereUniqueInput!) {
                ${resource}(where: $where) {
                    ${fields[resource as keyof typeof fields]}
                }
            }`,
        variables: {
          where: { id: Number(params.id) },
        },
      })
      .then((result) => ({ data: result.data[resource] }));
  },
  getMany: (resource: string, params: { ids: Identifier[] }) => {
    return client
      .query({
        query: gql`
            query ($where: ${capitalizeFirstLetter(resource)}WhereInput!) {
                ${resource}s(where: $where) {
                    ${fields[resource as keyof typeof fields]}
                }
            }`,
        variables: {
          where: {
            id: { in: params.ids.map((_) => Number(_)) },
          },
        },
      })
      .then((result) => ({ data: result.data[`${resource}s`] }));
  },
  getManyReference: (
    resource: string,
    {
      target,
      id,
      sort,
      pagination,
      filter,
    }: {
      target: string;
      id: Identifier;
      sort: { field: string; order: string };
      pagination: { page: number; perPage: number };
      filter: any;
    }
  ) => {
    const { field, order } = sort;
    const { page, perPage } = pagination;
    return client
      .query({
        query: gql`
            query ($take: Int, $skip: Int, $order_by: [${capitalizeFirstLetter(
              resource
            )}OrderByWithRelationInput!], $where: ${capitalizeFirstLetter(
          resource
        )}WhereInput!) {
                ${resource}s(take: $take, skip: $skip, orderBy: $order_by, where: $where) {
                    ${fields[resource as keyof typeof fields]}
                }
                ${resource}sCount(where: $where)
            }`,
        variables: {
          take: perPage,
          skip: (page - 1) * perPage,
          order_by: { [field]: order.toLowerCase() },
          where: {
            [`${target}`]: { equals: Number(id) },
          },
        },
      })
      .then((result) => ({
        data: result.data[`${resource}s`],
        total: result.data[`${resource}sCount`],
      }));
  },
  create: (resource: string, params: { data: any }) => {
    const keys = Object.keys(params.data).filter((_) => _.endsWith("Id"));
    keys.forEach((key) => {
      const newKey = key.replace("Id", "");
      if (params.data[key]) {
        params.data[newKey] = {
          connect: { id: Number(params.data[key]) },
        };
      }
      delete params.data[key];
    });
    return client
      .mutate({
        mutation: gql`
            mutation ($data: ${capitalizeFirstLetter(resource)}CreateInput!) {
              ${resource}Create(data: $data) {
                    ${fields[resource as keyof typeof fields]}
                }
            }`,
        variables: {
          data: omit(params.data, ["__typename"]),
        },
      })
      .then((result) => ({
        data: result.data[`${resource}Create`],
      }));
  },
  update: (resource: string, params: { data: any; id: Identifier }) => {
    delete params.data.id;
    const notIdKeys = Object.keys(params.data).filter((_) => !_.endsWith("Id"));
    notIdKeys.forEach((key) => {
      params.data[key] = { set: params.data[key] };
    });
    const idKeys = Object.keys(params.data).filter((_) => _.endsWith("Id"));
    idKeys.forEach((key) => {
      const newKey = key.replace("Id", "");
      if (params.data[key]) {
        params.data[newKey] = {
          connect: { id: Number(params.data[key]) },
        };
      } else {
        params.data[newKey] = {
          disconnect: true,
        };
      }
      delete params.data[key];
    });
    return client
      .mutate({
        mutation: gql`
            mutation ($where: ${capitalizeFirstLetter(
              resource
            )}WhereUniqueInput!, $data: ${capitalizeFirstLetter(
          resource
        )}UpdateInput!) {
                ${resource}Update(where: $where, data: $data) {
                    ${fields[resource as keyof typeof fields]}
                }
            }`,
        variables: {
          where: { id: Number(params.id) },
          data: omit(params.data, ["__typename"]),
        },
      })
      .then((result) => ({
        data: result.data[`${resource}Update`],
      }));
  },
  updateMany: (resource: string, params: { ids: Identifier[]; data: any }) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($where: ${capitalizeFirstLetter(
              resource
            )}WhereInput!, $data: ${capitalizeFirstLetter(
          resource
        )}UpdateManyMutationInput!) {
                ${resource}UpdateMany(where: $where, data: $data)
            }`,
        variables: {
          where: {
            id: { in: params.ids },
          },
          data: omit(params.data, ["__typename"]),
        },
      })
      .then((result) => ({
        data: params.ids,
      }));
  },
  delete: (resource: string, params: { id: Identifier }) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($id: Int!) {
                ${resource}Delete(where: {id: $id}) {
                    ${fields[resource as keyof typeof fields]}
                }
            }`,
        variables: {
          id: params.id,
        },
      })
      .then((result) => ({
        data: result.data[`${resource}Delete`],
      }));
  },
  deleteMany: (resource: string, params: { ids: Identifier[] }) => {
    return client
      .mutate({
        mutation: gql`
            mutation ($where: ${capitalizeFirstLetter(resource)}WhereInput!) {
                ${resource}DeleteMany(where: $where)
            }`,
        variables: {
          where: {
            id: { in: params.ids.map((_) => Number(_)) },
          },
        },
      })
      .then((result) => ({
        data: params.ids,
      }));
  },
};
