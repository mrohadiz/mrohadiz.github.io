# _plugins/last_modified_at.rb
# Automatically sets last_modified_at from git log for posts/pages/documents
# that don't have it explicitly set in frontmatter.
# Falls back gracefully if git is not available.

module Jekyll
  Jekyll::Hooks.register [:posts, :pages, :documents], :pre_render do |doc|
    unless doc.data['last_modified_at']
      begin
        git_date = `git log -1 --format="%ai" -- "#{doc.path}" 2>/dev/null`.strip
        doc.data['last_modified_at'] = git_date unless git_date.empty?
      rescue StandardError
        # Silently ignore if git is not available
      end
    end
  end
end
