Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :repos, only: [:show, :create, :update, :destroy]
      resources :users, only: [:show, :index, :create, :update, :destroy]
    end
  end
end
