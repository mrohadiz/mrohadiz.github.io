module Jekyll
  Jekyll::Hooks.register :site, :post_write do |site|
    index = []

    site.posts.docs.each do |post|
      index << {
        'title' => post.data['title'] || post.data['title'],
        'url' => post.url,
        'date' => post.date.strftime('%b %d, %Y'),
        'tags' => (post.data['tags'] || []).join(', '),
        'categories' => (post.data['categories'] || []).join(', '),
        'excerpt' => post.data['excerpt'] ? post.data['excerpt'].strip.gsub(/<[^>]*>/, '')[0, 200] : '',
        'content' => post.content.gsub(/<[^>]*>/, ' ').gsub(/\s+/, ' ')[0, 500]
      }
    end

    site.pages.each do |page|
      next if page.url =~ /\.(json|xml|txt|css|js|png|jpg|gif|svg)$/
      index << {
        'title' => page.data['title'] || page.data['title'],
        'url' => page.url,
        'date' => page.data['date'] ? (page.data['date'].respond_to?(:strftime) ? page.data['date'].strftime('%b %d, %Y') : page.data['date'].to_s) : '',
        'tags' => (page.data['tags'] || []).join(', '),
        'content' => page.content.gsub(/<[^>]*>/, ' ').gsub(/\s+/, ' ')[0, 500]
      }
    end

    File.write(File.join(site.dest, 'search-index.json'), index.to_json)
  end
end
