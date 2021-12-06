import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      const items = existing.slice(skip, skip + first).filter((x) => x);
      if (items.length && items.length !== first && page === pages) {
        // last page
        return items;
      }

      if (items.length !== first) {
        // we don't have any items, fetch from network
        return false;
      }

      if (items.length) {
        return items;
      }

      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip } = args;
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }
      return merged;
    },
  };
}
