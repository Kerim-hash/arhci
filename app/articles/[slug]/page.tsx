import React from 'react';

const articleData = {
  "content": `
    <article class="max-w-4xl mx-auto px-4 py-8 font-serif">
      <h1 class="text-3xl md:text-4xl font-bold mb-6 pb-4 border-b border-gray-200">Тоё Ито и Музей Архитектуры в Имабари</h1>
      
      <div class="text-lg leading-relaxed mb-8">
        <p class="mb-4"><strong>Тоё Ито</strong> — один из самых влиятельных современных японских архитекторов...</p>
        <p>Одним из наиболее значимых проектов является <strong>Музей Архитектуры Тоё Ито</strong>...</p>
      </div>
      
      <figure class="my-8">
        <img src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90" 
             alt="Музей Архитектуры Тоё Ито" 
             class="w-full h-auto rounded-lg shadow-lg" />
        <figcaption class="text-center italic text-gray-600 mt-2">Музей Архитектуры Тоё Ито в Имабари</figcaption>
      </figure>
      
      <section class="my-8">
        <h2 class="text-2xl font-bold mb-4 pb-2 border-b border-gray-100">Концепция и расположение</h2>
        <p class="mb-4">Музей, открытый в 2011 году, является <strong>первым в Японии музеем, посвящённым творчеству отдельного архитектора</strong>...</p>
      </section>
      
      <section class="my-8">
        <h2 class="text-2xl font-bold mb-4 pb-2 border-b border-gray-100">Два здания-близнеца</h2>
        
        <div class="my-6">
          <h3 class="text-xl font-semibold mb-3">1. «Стальная хижина» (Steel Hut)</h3>
          <div class="flex flex-col md:flex-row gap-6">
            <figure class="md:w-1/3">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00" 
                   alt="Стальная хижина" 
                   class="w-full h-48 object-cover rounded-lg" />
              <figcaption class="text-sm italic text-gray-500 mt-1">Интерьер Стальной хижины</figcaption>
            </figure>
            <div class="md:w-2/3">
              <p class="mb-3"><strong>Стиль и форма:</strong> Это основное выставочное пространство...</p>
              <p class="mb-3"><strong>Конструкция:</strong> Оно облицовано матовыми стальными листами...</p>
            </div>
          </div>
        </div>
      </section>
    </article>
  `
};

const ArticleComponent = () => {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: articleData.content }}
      className="prose prose-lg max-w-none"
    />
  );
};

export default ArticleComponent;