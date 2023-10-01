Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Set the root route
  root to: 'game#index'
  # Defines the root path route ("/")
  # root "articles#index"


  post '/save_player', to: 'game#save_player', defaults: { format: 'json' }

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      patch '/players/:id/update_score', to: 'players#update_score'
    end
  end


  resources :players do
    member do
      get 'high_scores'
      get 'levels'
      get 'power_ups'
    end
  end

  resources :levels do
    member do
      get 'players'
    end
  end

  resources :high_scores
  resources :power_ups do
    member do
      get 'player'
    end
  end

end
