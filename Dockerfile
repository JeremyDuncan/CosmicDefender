## ==============================================================================
## Use the official Ruby image from Docker Hub
## ------------------------------------------------------------------------------
#FROM ruby:3.2.2
#
## ==============================================================================
## Set environment variables
## ------------------------------------------------------------------------------
#ENV RAILS_ROOT /var/www/CosmicDefender
#ENV RAILS_ENV='production'
#ENV RACK_ENV='production'
#
## ==============================================================================
## Install system dependencies including Git
## ------------------------------------------------------------------------------
#RUN apt-get update -qq && apt-get install -y nodejs postgresql-client git
#
## ==============================================================================
## Clone the GitHub repository
## ------------------------------------------------------------------------------
#RUN git clone https://github.com/your-username/your-repo.git $RAILS_ROOT
#
## Change to the working directory
#WORKDIR $RAILS_ROOT
#
## ==============================================================================
## Install gems
## ------------------------------------------------------------------------------
#COPY Gemfile Gemfile
#COPY Gemfile.lock Gemfile.lock
#RUN bundle install --without development test
#
## ==============================================================================
## Precompile assets
## ------------------------------------------------------------------------------
#RUN bundle exec rails assets:precompile
#
## ==============================================================================
## Expose port 8537 to the Docker host
## ------------------------------------------------------------------------------
#EXPOSE 8537
#
## ==============================================================================
## The default command that gets run will start the Puma server
## ------------------------------------------------------------------------------
#CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
#



# ==============================================================================
# Use the official Ruby image from Docker Hub
# ------------------------------------------------------------------------------
FROM ruby:3.2.2

# ==============================================================================
# Set environment variables
# ------------------------------------------------------------------------------
ENV RAILS_ROOT /var/www/CosmicDefender
ENV RAILS_ENV='production'
ENV RACK_ENV='production'

# ==============================================================================
# Create and set the working directory
# ------------------------------------------------------------------------------
RUN mkdir -p $RAILS_ROOT && echo "Working directory created: $RAILS_ROOT"
WORKDIR $RAILS_ROOT

# ==============================================================================
# Install system dependencies
# ------------------------------------------------------------------------------
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client && echo "System dependencies installed"

# ==============================================================================
# Copy Gemfile and install gems
# ------------------------------------------------------------------------------
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN bundle install --without development test && echo "Gems installed"

# ==============================================================================
# Copy the main application
# ------------------------------------------------------------------------------
COPY . .
RUN echo "Application code copied"

# ==============================================================================
# Precompile assets
# ------------------------------------------------------------------------------
RUN bundle exec rails assets:precompile && echo "Assets precompiled"

# ==============================================================================
# Expose port 8537 to the Docker host
# ------------------------------------------------------------------------------
EXPOSE 8537

# ==============================================================================
# The default command that gets run will start the Puma server
# ------------------------------------------------------------------------------
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
