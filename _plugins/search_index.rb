module Jekyll
  class SearchIndexGenerator < Generator
    safe true
    priority :lowest

    def generate(site)
      index = []

      site.posts.docs.each do |post|
        index << {
          'title' => post.data['title'] || post.title,
          'url' => post.url,
          'date' => post.date.strftime('%b %d, %Y'),
          'tags' => (post.data['tags'] || []).join(', '),
          'categories' => (post.data['categories'] || []).join(', '),
          'excerpt' => post.data['excerpt'] ? post.data['excerpt'].strip.gsub(/<[^>]*>/, '').truncate(200) : '',
          'content' => post.content.gsub(/<[^>]*>/, ' ').gsub(/\s+/, ' ').truncate(500)
        }
      end

      site.pages.each do |page|
        next if page.url =~ /\.(json|xml|txt|css|js|png|jpg|gif|svg)$/
        index << {
          'title' => page.data['title'] || page.title,
          'url' => page.url,
          'date' => page.date ? page.date.strftime('%b %d, %Y') : '',
          'tags' => (page.data['tags'] || []).join(', '),
          'content' => page.content.gsub(/<[^>]*>/, ' ').gsub(/\s+/, ' ').truncate(500)
        }
      end

      site.static_files << StaticFile.new(site, site.source, '/', 'search-index.json', index.to_json)
    end
  end
end
