require 'rails_helper'

describe 'Users' do
  let(:user) { create(:user) }

  describe 'show' do
    example 'get user' do
      get "/api/v1/users/#{user.id}"
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'create' do
    example 'create user' do
      new_user = attributes_for(:user)
      post "/api/v1/users", params: { user: new_user }

      expect(response).to have_http_status(:created)
    end

    example 'cant create user' do
      new_user = attributes_for(:user, name: nil)
      post "/api/v1/users", params: { user: new_user }

      expect(response).to have_http_status(422)
    end
  end

  describe 'update' do
    example 'update user' do
      put "/api/v1/users/#{user.id}", params: {
        user: {
          name: 'new name'
        }
      }

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'destroy' do
    example 'destroy user' do
      delete "/api/v1/users/#{user.id}"

      expect(response).to have_http_status(:ok)
    end
  end
end
