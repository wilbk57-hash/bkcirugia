/* Integra apenas dados curados do repositório, antes do índice de pesquisa. */
(function () {
  'use strict';
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const text = value => typeof value === 'string';
  const id = value => text(value) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  const list = (value, check) => Array.isArray(value) && value.every(check);
  const strings = value => list(value, text);
  const question = q => record(q) && text(q.q) && strings(q.options) && q.options.length > 1 &&
    Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length && text(q.explain);
  const table = value => value === undefined || (record(value) && text(value.title) &&
    list(value.rows, row => Array.isArray(row) && row.length >= 2));

  function validTab(tab) {
    if (!record(tab) || !id(tab.id) || !text(tab.label)) return false;
    switch (tab.type) {
      case 'hero': return true;
      case 'sections': return list(tab.sections, s => record(s) && text(s.h) && text(s.t)) && table(tab.table);
      case 'checklist': return list(tab.groups, g => record(g) && text(g.title) && text(g.body));
      case 'accordion': return list(tab.items, i => record(i) && text(i.title) && text(i.body));
      case 'case': return Array.isArray(tab.steps) && tab.steps.length > 0 &&
        tab.steps.every(s => record(s) && text(s.tag) && text(s.title) && text(s.body));
      case 'quiz': return Array.isArray(tab.questions) && tab.questions.length > 0 && tab.questions.every(question);
      case 'lesson': return record(tab.intro) && ['why', 'where', 'importance', 'applications'].every(k => text(tab.intro[k])) &&
        strings(tab.objectives) && list(tab.sections, s => record(s) &&
          ['title', 'explanation', 'example', 'summary'].every(k => text(s[k])) && table(s.table)) &&
        list(tab.exercises, question) && record(tab.review) &&
        list(tab.review.mindMap, branch => record(branch) && text(branch.root) && strings(branch.children)) &&
        text(tab.review.summary) && strings(tab.review.keywords) && text(tab.connection);
      default: return false;
    }
  }

  function validEntry(key, entry) {
    if (!id(key) || !record(entry) || !record(entry.topic)) return false;
    const topic = entry.topic;
    if (topic.id !== key || !text(topic.title) || !topic.title.trim() || !text(topic.eyebrow) || !text(topic.sub) ||
      !Array.isArray(topic.tabs) || !topic.tabs.length || !topic.tabs.every(validTab) ||
      new Set(topic.tabs.map(tab => tab.id)).size !== topic.tabs.length ||
      topic.tabs.filter(tab => tab.type === 'case').length > 1 || topic.tabs.filter(tab => tab.type === 'quiz').length > 1 ||
      !list(topic.tags, tag => record(tag) && text(tag.label) && text(tag.cls)) ||
      !list(topic.stats, stat => record(stat) && (text(stat.num) || typeof stat.num === 'number') && text(stat.label))) return false;
    if (entry.terms !== undefined && (!record(entry.terms) || !Object.values(entry.terms).every(term =>
      record(term) && ['name', 'defSimple', 'defAcademic', 'example'].every(k => text(term[k]))))) return false;
    return true;
  }

  function apply(content, topics, terms, catalog) {
    const result = { loaded: [], rejected: [] };
    if (!record(content)) return result;
    for (const [key, entry] of Object.entries(content)) {
      if (['__proto__', 'constructor', 'prototype'].includes(key) || !validEntry(key, entry)) {
        result.rejected.push(key);
        continue;
      }
      let group = catalog.find(tema => tema.subs.some(sub => sub.id === key));
      if (!group) {
        const placement = entry.catalog;
        if (!record(placement) || !text(placement.n) || !placement.n.trim() || !text(placement.title) || !placement.title.trim()) {
          result.rejected.push(key);
          continue;
        }
        group = catalog.find(tema => tema.n === placement.n);
        if (!group) {
          group = { n: placement.n, title: placement.title, subs: [] };
          catalog.push(group);
        }
        group.subs.push({ id: key, title: entry.topic.title, status: 'ready' });
      }
      topics[key] = entry.topic;
      for (const [termId, term] of Object.entries(entry.terms || {})) {
        if (!['__proto__', 'constructor', 'prototype'].includes(termId)) terms[termId] = term;
      }
      group.subs.find(sub => sub.id === key).status = 'ready';
      result.loaded.push(key);
    }
    return result;
  }

  window.BKStudyTopics = { apply };
})();