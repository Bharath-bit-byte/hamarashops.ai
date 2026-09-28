export const RELIABLE_AI_IMAGES = {
  cognitive: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  vision: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80',
  nlp: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
  cyber: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  mlops: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
  generative: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
  predictive: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  fraud: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80',
  retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  fintech: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
  healthcare: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  manufacturing: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  logistics: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  company: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
};

export const handleImageError = (e, fallbackKey = 'default') => {
  e.target.onerror = null;
  e.target.src = RELIABLE_AI_IMAGES[fallbackKey] || RELIABLE_AI_IMAGES.default;
};

export const getSmartImage = (item) => {
  if (item && item.image && !item.image.includes('lh3.googleusercontent.com')) {
    return item.image;
  }
  const text = (item?.slug || item?.title || item?.name || item?.category || '').toLowerCase();
  if (text.includes('cognitive') || text.includes('automation')) return RELIABLE_AI_IMAGES.cognitive;
  if (text.includes('data') || text.includes('analytics')) return RELIABLE_AI_IMAGES.data;
  if (text.includes('vision') || text.includes('computer')) return RELIABLE_AI_IMAGES.vision;
  if (text.includes('nlp') || text.includes('language')) return RELIABLE_AI_IMAGES.nlp;
  if (text.includes('cyber') || text.includes('security') || text.includes('defensive') || text.includes('fraud')) return RELIABLE_AI_IMAGES.cyber;
  if (text.includes('mlops') || text.includes('pipeline') || text.includes('devops')) return RELIABLE_AI_IMAGES.mlops;
  if (text.includes('generative') || text.includes('llm')) return RELIABLE_AI_IMAGES.generative;
  if (text.includes('predictive') || text.includes('maintenance')) return RELIABLE_AI_IMAGES.predictive;
  if (text.includes('retail') || text.includes('commerce') || text.includes('recommend')) return RELIABLE_AI_IMAGES.retail;
  if (text.includes('fintech') || text.includes('bank') || text.includes('finance')) return RELIABLE_AI_IMAGES.fintech;
  if (text.includes('health') || text.includes('medical') || text.includes('clinical')) return RELIABLE_AI_IMAGES.healthcare;
  if (text.includes('manufactur') || text.includes('industrial') || text.includes('factory')) return RELIABLE_AI_IMAGES.manufacturing;
  if (text.includes('supply') || text.includes('logistics') || text.includes('freight')) return RELIABLE_AI_IMAGES.logistics;
  if (text.includes('company') || text.includes('profile')) return RELIABLE_AI_IMAGES.company;
  return RELIABLE_AI_IMAGES.default;
};
