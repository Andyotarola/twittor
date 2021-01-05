function actualizaCacheDinamico(dinamicCache, req, res){

    if(res.ok){
        return caches.open(dinamicCache)
            .then(cache => {
                cache.put(req, res.clone())

                return res.clone()
            })
    }else{
        return res;
    }

}